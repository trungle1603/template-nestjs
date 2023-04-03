import { IsDefined } from 'class-validator';
import { JwtPayload } from 'jsonwebtoken';
import { JWT_TYPE } from '../../../common/enums/jwt-type.enum';
import { ERR_MSG } from '@common/constants/err-msg.constant';

export class JwtVerifyDecoded implements JwtPayload {
    @IsDefined({ message: ERR_MSG.INVALID(`token`) })
    sub: string;

    @IsDefined({ message: ERR_MSG.INVALID(`token`) })
    jti: string;

    @IsDefined({ message: ERR_MSG.INVALID(`token`) })
    type: JWT_TYPE;

    @IsDefined({ message: ERR_MSG.INVALID(`token`) })
    exp: number;
}
