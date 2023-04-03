import { JwtConfigService } from '@common/config/services/jwt-config.service';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { EmailModule } from '../email/email.module';
import { RevokeTokenModule } from '../revoke-token/revoke-token.module';
import { RoleModule } from '../role/role.module';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
    imports: [
        JwtModule.registerAsync({
            useClass: JwtConfigService,
        }),
        PassportModule,
        UserModule,
        RevokeTokenModule,
        EmailModule,
        RoleModule,
    ],
    providers: [AuthService, AuthResolver, JwtStrategy],
    controllers: [AuthController],
})
export class AuthModule {}
