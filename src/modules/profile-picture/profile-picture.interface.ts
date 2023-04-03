import { BaseInterface } from '@common/interfaces/base.interface';
import { ObjectID } from '@common/types/object-id.type';
import { UserInterface } from '@modules/user/user.interface';

export interface ProfilePictureInterface extends BaseInterface {
    author: ObjectID | UserInterface;
    originalname: string;
    mimetype: string;
    size: number;
    buffer: Buffer | string;
}
