import { Inject, InternalServerErrorException } from '@nestjs/common';
import { ConfigType, registerAs } from '@nestjs/config';
import { existsSync } from 'fs';
import path from 'path';
import * as fs from 'node:fs/promises';
import { MILLISECONDS } from '@common/enums/millisecond.enum';
import { ERR_MSG } from '@common/constants/err-msg.constant';

export const jwtConfig = registerAs('jwt', async function () {
    const jwtKeyPairPath = path.join(process.cwd(), 'certificates/jwt');
    const privateKeyPath = `${jwtKeyPairPath}/private.pem`;
    const publicKeyPath = `${jwtKeyPairPath}/public.pem`;

    if (existsSync(privateKeyPath) || existsSync(publicKeyPath)) {
        const [privateKey, publicKey] = await Promise.all([
            fs.readFile(privateKeyPath),
            fs.readFile(publicKeyPath),
        ]);

        return {
            algorithms: 'RS256',
            privateKey,
            publicKey,

            accessTokenExpirationTime:
                Number(process.env.JWT_AT_EXPIRATION_TIME) ||
                (MILLISECONDS.ONE_MINUTE * 10) / 1000,

            refreshTokenExpirationTime:
                Number(process.env.JWT_RT_EXPIRATION_TIME) ||
                (MILLISECONDS.ONE_DAY * 7) / 1000, // 7 days
        };
    }

    throw new InternalServerErrorException(
        ERR_MSG.MISSING('Key pair') +
            ". Please run 'yarn run gen:jwt-key-pair' to generate it",
    );
});

export type JwtConfig = ConfigType<typeof jwtConfig>;
export function InjectJwtConfig() {
    return Inject(jwtConfig.KEY);
}
