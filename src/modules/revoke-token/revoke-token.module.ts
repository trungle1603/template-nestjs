import { JwtConfigService } from '@common/config/services/jwt-config.service';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { RevokeTokenSchema } from './revoke-token.model';
import { RevokeTokenService } from './revoke-token.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: 'RevokeToken',
                schema: RevokeTokenSchema,
            },
        ]),
        JwtModule.registerAsync({
            useClass: JwtConfigService,
        }),
    ],
    providers: [RevokeTokenService],
    exports: [RevokeTokenService],
})
export class RevokeTokenModule {}
