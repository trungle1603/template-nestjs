import { Roles } from '@common/decorators/role.decorator';
import { ROLE } from '@common/enums/role.enum';
import {
    Controller,
    Get,
    Post,
    Query,
    Res,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { StreamGridFsFile } from './dtos/param-id.dto';
import { GridFsService } from './grid-fs.service';

@Roles(ROLE.ADMIN)
@Controller('grid-fs')
export class GridFsController {
    constructor(private readonly gridFsService: GridFsService) {}

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(
        @UploadedFile() file: Express.Multer.File,
    ): Promise<Express.Multer.File> {
        return file;
    }

    @Get('stream')
    async streamGridFsFile(
        @Query() query: StreamGridFsFile,
        @Res() res: Response,
    ) {
        return this.gridFsService.streamFile(query, res);
    }
}
