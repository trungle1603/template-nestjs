import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserPassportObjectInterface } from '@modules/user/user.interface';
import { InjectJwtConfig, JwtConfig } from '@common/config/config.jwt';
import { validate } from '@common/validations/validate.validation';
import { UserService } from '@modules/user/user.service';
import { RevokeTokenService } from '@modules/revoke-token/revoke-token.service';
import { JwtPayloadInterface } from '../auth.interface';
import { JwtVerifyDecoded } from '../dtos/jwt-verify-decoded.dto';
import { JWT_TYPE } from '../../../common/enums/jwt-type.enum';
import { ERR_MSG } from '@common/constants/err-msg.constant';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectJwtConfig() readonly jwtConfig: JwtConfig,
        private readonly userService: UserService,
        private readonly revokeTokenService: RevokeTokenService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: jwtConfig.publicKey,
            algorithms: ['RS256'],
            ignoreExpiration: false,
        });
    }

    async validate(
        payload: JwtPayloadInterface,
    ): Promise<UserPassportObjectInterface> {
        // Validate with class-validator, error catch at global.filter.ts
        await validate(new JwtVerifyDecoded(), payload);

        const userId = payload.sub;
        const tokenID = payload.jti;
        const tokenType = payload.type;

        const [user, tokenRevoked] = await Promise.all([
            this.userService.getOne({ _id: userId }),
            this.revokeTokenService.isRevoked(tokenID),
        ]);

        const { isEmailVerified, refreshToken, roles } = user;
        // Error send to guard
        if (tokenType !== JWT_TYPE.ACCESS_TOKEN) {
            throw new UnauthorizedException(
                ERR_MSG.INVALID(JWT_TYPE.ACCESS_TOKEN),
            );
        }
        if (!isEmailVerified) {
            throw new UnauthorizedException(ERR_MSG.ACCOUNT_VERIFY);
        }
        if (!refreshToken || tokenRevoked) {
            throw new UnauthorizedException(ERR_MSG.REVOKED_TOKEN);
        }
        if (!roles || typeof roles[0] === 'string') {
            throw new UnauthorizedException(ERR_MSG.MISSING('role'));
        }

        return user;
    }
}
