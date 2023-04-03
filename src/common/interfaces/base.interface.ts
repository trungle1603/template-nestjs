import { ObjectID } from '@common/types/object-id.type';

export interface BaseInterface {
    _id: string | ObjectID;
    createdAt?: Date;
    updatedAt?: Date;
}
