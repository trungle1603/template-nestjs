import { RequestExpressInterface } from '@common/interfaces/http-message.interface';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { MulterOptionsFactory } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { randomUUID } from 'crypto';
import { Request } from 'express';
import { GridFSBucket, ObjectId } from 'mongodb';
import { Connection } from 'mongoose';
import { diskStorage } from 'multer';
import path, { extname } from 'path';

@Injectable()
export class GridFsConfigService implements MulterOptionsFactory {
    tempDirPath = path.join(process.cwd(), 'data/multer');
    bucket: GridFSBucket;

    constructor(
        @InjectConnection() private readonly mongooseConnection: Connection,
    ) {
        this.bucket = new GridFSBucket(this.mongooseConnection.db);
    }

    createMulterOptions(): MulterOptions | Promise<MulterOptions> {
        const storage = diskStorage({
            destination: this.tempDirPath,
            filename(req, file, callback) {
                const uniqueSuffix = randomUUID();
                callback(null, `${uniqueSuffix}${extname(file.originalname)}`);
            },
        });

        storage._handleFile = async (
            req: RequestExpressInterface,
            file: Express.Multer.File,
            callback: (
                error?: any,
                info?: Partial<Express.Multer.File>,
            ) => void,
        ) => {
            const { stream, originalname, mimetype } = file;
            const uploadStream = this.bucket.openUploadStream(originalname, {
                contentType: mimetype,
            });

            stream.pipe(uploadStream);

            uploadStream.on('error', () =>
                callback(new BadRequestException('Upload error')),
            );
            uploadStream.on('finish', () => {
                callback(null, {
                    path: uploadStream.id.toString(),
                    filename: uploadStream.filename,
                    size: uploadStream.length,
                });
            });
        };

        storage._removeFile = (
            req: Request,
            file: Express.Multer.File,
            callback: (error: Error | null) => void,
        ) => {
            this.bucket.delete(new ObjectId(file.path));
            callback(new BadRequestException('Upload error'));
        };

        return { storage };
    }
}
