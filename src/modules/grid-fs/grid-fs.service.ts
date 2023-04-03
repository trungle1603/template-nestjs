import { CacheService } from '@common/cache/cache.service';
import { SUCCESSFUL_MSG } from '@common/constants/success-msg.constant';
import {
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Response } from 'express';
import { GridFSBucket, ObjectId } from 'mongodb';
import os from 'os';
import { StreamGridFsFile } from './dtos/param-id.dto';
import { GridFsFileDocument, GridFsFileModel } from './grid-fs.model';
import { GridFsConfigService } from './services/grid-fs-config.service';
import { ERR_MSG } from '@common/constants/err-msg.constant';

/**
 * https://www.mongodb.com/docs/drivers/node/current/fundamentals/gridfs
 */
@Injectable()
export class GridFsService {
    private bucket: GridFSBucket = this.gridFsConfigService.bucket;

    constructor(
        @InjectModel('fs.files') private readonly gridFsModel: GridFsFileModel,
        private readonly cacheService: CacheService,
        private readonly gridFsConfigService: GridFsConfigService,
    ) {}

    async streamFile({ id, download }: StreamGridFsFile, res: Response) {
        const { contentType, filename, length } = await this.getGridFsFile(id);
        const downloadStream = this.bucket.openDownloadStream(new ObjectId(id));

        res.setHeader('Content-Type', contentType);
        res.setHeader('Content-Length', length);
        if (Boolean(download) === true) {
            res.setHeader(
                'Content-Disposition',
                `attachment; filename=${filename}`,
            ); // serving a file as an attachment
        }
        downloadStream.pipe(res);
    }

    async getGridFsFile(id: string) {
        const cacheKey = this.cacheService.buildKey(
            `${GridFsService.name}_getGridFsFile`,
            { _id: id },
        );

        // Data from cache
        let file = await this.cacheService.get<GridFsFileDocument>(cacheKey);
        if (file) return file;

        // data from db
        file = await this.gridFsModel.findById(id).lean();
        if (file) {
            await this.cacheService.set<GridFsFileDocument>(cacheKey, file);
            return file;
        }

        throw new NotFoundException(ERR_MSG.NOT_FOUND('file'));
    }

    async deleteFile(id: string): Promise<string> {
        const cacheKey = this.cacheService.buildKey(
            `${GridFsService.name}_getGridFsFile`,
            { _id: id },
        );

        try {
            await Promise.all([
                this.cacheService.del(cacheKey),
                this.bucket.delete(new ObjectId(id)),
            ]);
        } catch (error) {
            if (error.message.indexOf('File not found') !== -1) {
                throw new NotFoundException(ERR_MSG.NOT_FOUND('file'));
            }
            throw new InternalServerErrorException(error.message);
        }
        return SUCCESSFUL_MSG;
    }

    private adjustChunkSize(fileSize: number): number {
        const totalMemory = os.totalmem();
        const freeMemory = os.freemem();

        // Use 50% memory that is not currently in use
        const availableMemory = freeMemory + (totalMemory - freeMemory) / 2;

        // Use up to 25% of the available memory for each chunk
        const maxChunkSize = availableMemory / 4;
        const minChunkSize = 1024 * 1024; // Minimum chunk size of 1MB

        // Use 1/10 of the file size as a starting point
        return Math.min(maxChunkSize, Math.max(minChunkSize, fileSize / 10));
    }
}
