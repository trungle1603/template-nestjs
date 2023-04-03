import { ERR_MSG } from '@common/constants/err-msg.constant';
import { IsDefined } from 'class-validator';
import { JwtPayload } from 'jsonwebtoken';

export class JwtDecoded implements JwtPayload {
    @IsDefined({ message: ERR_MSG.INVALID(`token`) })
    jti: string;

    @IsDefined({ message: ERR_MSG.INVALID(`token`) })
    exp: number;
}
