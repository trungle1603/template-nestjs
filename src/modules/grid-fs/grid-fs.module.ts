import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { GridFsController } from './grid-fs.controller';
import { GridFsFileSchema } from './grid-fs.model';
import { GridFsResolver } from './grid-fs.resolver';
import { GridFsService } from './grid-fs.service';
import { GridFsConfigService } from './services/grid-fs-config.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: 'fs.files',
                schema: GridFsFileSchema,
            },
        ]),
        MulterModule.registerAsync({
            useClass: GridFsConfigService,
        }),
    ],
    providers: [GridFsService, GridFsResolver, GridFsConfigService],
    exports: [GridFsService],
    controllers: [GridFsController],
})
export class GridFsModule {}
