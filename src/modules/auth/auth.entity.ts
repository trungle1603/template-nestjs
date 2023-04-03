import { ALIAS } from '@common/enums/alias.enum';
import { ObjectType } from '@nestjs/graphql';
import { AuthInterface } from './auth.interface';

@ObjectType(ALIAS.AUTH)
export class AuthEntity implements AuthInterface {
    /**
     * Access token sign by server.
     * Use to access resource.
     */
    accessToken: string;

    /**
     * Refresh token sign by server.
     * Use to refresh token.
     */
    refreshToken: string;

    /**
     * Use public key to verify and decode accessToken and refreshToken
     */
    publicKey: string;
}
