import { MILLISECONDS } from '@common/enums/millisecond.enum';
import { validate } from '@common/validations/validate.validation';
import { JwtDecoded } from '@modules/auth/dtos/jwt-decoded.dto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule/dist';
import { RevokeTokenModel } from './revoke-token.model';
import { ERR_MSG } from '@common/constants/err-msg.constant';

@Injectable()
export class RevokeTokenService {
    constructor(
        @InjectModel('RevokeToken') private revokeTokenModel: RevokeTokenModel,
        private readonly jwtService: JwtService,
    ) {}

    async revoke(token: string): Promise<void> {
        const decoded = this.jwtService.decode(token, {
            json: true,
        }) as JwtDecoded;

        // Validate decoded with class-validator
        await validate(new JwtDecoded(), decoded);

        await this.revokeTokenModel.insertMany(
            {
                jti: decoded.jti,
                exp: decoded.exp, // seconds
            },
            { lean: true }, // skips hydrating and validating the documents
        );
    }

    async isRevoked(tokenId?: string): Promise<boolean> {
        if (!tokenId) {
            throw new UnauthorizedException(ERR_MSG.MISSING('token id'));
        }

        const revokeToken = await this.revokeTokenModel.findOne(
            { jti: tokenId },
            {},
            { lean: true },
        );
        return revokeToken ? true : false;
    }

    /**
     *
     * @param exp second
     * @returns true if current time is after expiry time
     */
    isTokenExpired(exp: number): boolean {
        const expiryTime = exp * MILLISECONDS.ONE_SECOND;
        const currentTime = Date.now();
        return currentTime > expiryTime;
    }

    @Cron(CronExpression.EVERY_DAY_AT_3AM)
    async clearExpiresRevokeToken() {
        const currentTime = Math.floor(Date.now() / 1000);
        await this.revokeTokenModel.deleteMany({ exp: { $lt: currentTime } });
    }
}
