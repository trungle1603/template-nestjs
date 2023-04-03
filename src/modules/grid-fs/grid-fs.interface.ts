import { BaseInterface } from '@common/interfaces/base.interface';

export interface GridFsFileInterface extends BaseInterface {
    length: number; // bytes
    chunkSize: number; // bytes
    uploadDate: Date;
    filename: string;
    contentType: string;
}
