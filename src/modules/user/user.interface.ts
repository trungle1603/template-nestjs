import { ObjectID } from '@common/types/object-id.type';
import { RoleInterface } from '@modules/role/role.interface';
import { BaseInterface } from '../../common/interfaces/base.interface';

interface UserInterface extends BaseInterface {
    displayName: string;
    email: string;
    roles: ObjectID[] | RoleInterface[];
    isEmailVerified: boolean;
    phoneNumber?: string;

    password: string;
    refreshToken: string;
}

interface UserPassportObjectInterface extends UserInterface {
    _id: ObjectID;
    roles: RoleInterface[];
}

export { UserInterface, UserPassportObjectInterface };
