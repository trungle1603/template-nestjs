import * as jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';
import { JWT_TYPE } from '../../common/enums/jwt-type.enum';

export interface AuthInterface {
    accessToken: string;
    refreshToken: string;
    publicKey: string;
}

export interface JwtPayloadInterface extends JwtPayload {
    sub: string;
    jti: string;
    type: JWT_TYPE;
}

export interface SignJwtInterface {
    type: JWT_TYPE;
    userId: string;
    opts?: jwt.SignOptions;
}
