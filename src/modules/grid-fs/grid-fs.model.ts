import { HydratedDocument, Model, Schema } from 'mongoose';
import { GridFsFileInterface } from './grid-fs.interface';

export type GridFsFileDocument = HydratedDocument<GridFsFileInterface>;
export type GridFsFileModel = Model<GridFsFileDocument>;

export const GridFsFileSchema = new Schema<GridFsFileDocument>(
    {
        length: Number,
        chunkSize: Number,
        uploadDate: Date,
        filename: String,
        contentType: String,
    },
    { timestamps: false },
);
