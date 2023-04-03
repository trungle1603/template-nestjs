import { BaseInterface } from '@common/interfaces/base.interface';

export interface RevokeTokenInterface extends BaseInterface {
    jti: string;
    exp: number;
}
