import { Injectable } from '@nestjs/common';
import { JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt';
import { Algorithm } from 'jsonwebtoken';
import { InjectJwtConfig, JwtConfig } from '../config.jwt';

@Injectable()
export class JwtConfigService implements JwtOptionsFactory {
    constructor(@InjectJwtConfig() private readonly jwtConfig: JwtConfig) {}

    createJwtOptions(): JwtModuleOptions | Promise<JwtModuleOptions> {
        const { publicKey, privateKey, accessTokenExpirationTime, algorithms } =
            this.jwtConfig;

        return {
            publicKey,
            privateKey,
            signOptions: {
                expiresIn: accessTokenExpirationTime,
                algorithm: algorithms as Algorithm,
            },
        };
    }
}
