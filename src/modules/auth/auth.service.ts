import { InjectJwtConfig, JwtConfig } from '@common/config/config.jwt';
import { SUCCESSFUL_MSG } from '@common/constants/success-msg.constant';
import { MILLISECONDS } from '@common/enums/millisecond.enum';
import { ROLE } from '@common/enums/role.enum';
import { safeCompare } from '@common/utils/safe-compare.util';
import { validate } from '@common/validations/validate.validation';
import { EmailService } from '@modules/email/email.service';
import { RevokeTokenService } from '@modules/revoke-token/revoke-token.service';
import { RoleService } from '@modules/role/role.service';
import { UserEntity } from '@modules/user/user.entity';
import {
    UserInterface,
    UserPassportObjectInterface,
} from '@modules/user/user.interface';
import { UserService } from '@modules/user/user.service';
import {
    BadRequestException,
    ConflictException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import {
    AUTH_ROUTE,
    FORGOT_PASSWORD_ROUTE,
    VERIFY_EMAIL_ROUTE,
} from './auth.constant';
import { JWT_TYPE } from '../../common/enums/jwt-type.enum';
import {
    AuthInterface,
    JwtPayloadInterface,
    SignJwtInterface,
} from './auth.interface';
import { JwtVerifyDecoded } from './dtos/jwt-verify-decoded.dto';
import { VerificationTokenDto } from './dtos/verification-token.dto';
import { ForgotPasswordInput } from './inputs/forgot-password.input';
import { LoginInput } from './inputs/login.input';
import { LogoutInput } from './inputs/logout.input';
import { RefreshTokenInput } from './inputs/refresh-token.input';
import { ResetPasswordInput } from './inputs/reset-password.input';
import { SignUpInput } from './inputs/sign-up.input';
import { VerifyForgotPasswordInput } from './inputs/verify-forgot-password.input';
import { ERR_MSG } from '@common/constants/err-msg.constant';
import { ALIAS } from '@common/enums/alias.enum';

@Injectable()
export class AuthService {
    private publicKey: string;

    constructor(
        @InjectJwtConfig() private readonly jwtConfig: JwtConfig,
        private readonly userService: UserService,
        private readonly roleService: RoleService,
        private readonly emailService: EmailService,
        private readonly jwtService: JwtService,
        private readonly revokeTokenService: RevokeTokenService,
    ) {
        this.publicKey = this.jwtConfig.publicKey.toString();
    }

    async signUp(signUpInput: SignUpInput): Promise<string> {
        // Check exist user
        const isExist = await this.userService.isExistUser(signUpInput.email);
        if (isExist) throw new ConflictException(ERR_MSG.EXIST(ALIAS.USER));

        // Generate default value for signup User
        const [password, roles] = await Promise.all([
            bcrypt.hash(signUpInput.password, 10),
            this.roleService.findRoleIDs(ROLE.USER),
        ]);
        signUpInput.password = password;
        signUpInput.roles = roles;

        // Create user model (The model has not been saved to the database yet)
        const user = this.userService.createUserModel(signUpInput);

        // Create jwt payload
        const payload: JwtPayloadInterface = {
            sub: user._id.toString(),
            jti: randomUUID(),
            type: JWT_TYPE.VERIFY_EMAIL,
        };

        // Sign jwt token and save user to database
        const [verificationToken] = await Promise.all([
            this.jwtService.signAsync(payload),
            user.save(), // save to database
        ]);

        // Sendmail with link: something.com/t=${token}
        const receiver = `${user.displayName} ${user.email}`;
        await this.emailService.sendVerificationEmail({
            to: receiver,
            token: verificationToken,
            subject: 'Verify Your Email',
            link: `${AUTH_ROUTE}/${VERIFY_EMAIL_ROUTE}`,
        });

        return SUCCESSFUL_MSG;
    }

    async verifyEmail(query: VerificationTokenDto): Promise<string> {
        const decoded = await this.jwtService.verifyAsync(query.token, {
            complete: false,
        });

        // Validate with class-validator, error catch at global.filter.ts
        await validate(new JwtVerifyDecoded(), decoded);

        if (decoded.type !== JWT_TYPE.VERIFY_EMAIL) {
            throw new UnauthorizedException(
                ERR_MSG.INVALID(JWT_TYPE.VERIFY_EMAIL),
            );
        }

        // Validate request is expires
        const isRevoked = await this.revokeTokenService.isRevoked(decoded.jti);
        if (isRevoked) {
            throw new BadRequestException(
                ERR_MSG.EXPIRES(JWT_TYPE.VERIFY_EMAIL),
            );
        }

        // Confirm email verification
        const result = await this.userService.validateAndVerifyEmail(
            decoded.sub,
        );
        if (result === SUCCESSFUL_MSG) {
            await this.revokeTokenService.revoke(query.token);
        }
        return result;
    }

    async login(loginInput: LoginInput): Promise<AuthInterface> {
        const { email, password } = loginInput;

        // Validate user and get info user
        const { _id, refreshToken: oldRefreshToken } =
            await this.validateEmailAndPassword(email, password);
        const userId = _id.toString();

        // Sign new JWT
        // const authInfo = await this.signJWTPair(userId);
        const [accessToken, refreshToken] = await Promise.all([
            this.signJWT({ type: JWT_TYPE.ACCESS_TOKEN, userId }),
            this.signJWT({
                type: JWT_TYPE.REFRESH_TOKEN,
                userId,
                opts: { expiresIn: this.jwtConfig.refreshTokenExpirationTime },
            }),
        ]);

        // Save new refresh token and revoke old refresh token
        await Promise.all([
            this.userService.update({ _id: userId }, { refreshToken }),
            this.revokeTokenService.revoke(oldRefreshToken),
        ]);

        return { accessToken, refreshToken, publicKey: this.publicKey };
    }

    async logout(input: LogoutInput): Promise<string> {
        input.accessToken = input.accessToken.split(' ')[1];
        const { accessToken, currentUserId } = input;

        const [user, decoded] = await Promise.all([
            this.userService.getOne({ _id: currentUserId.toString() }),
            this.jwtService.verifyAsync(accessToken, { complete: false }),
        ]);

        // Validate with class-validator, error catch at global.filter.ts
        await validate(new JwtVerifyDecoded(), decoded);

        const { refreshToken, _id: userId } = user;
        if (userId.toString() !== decoded.sub) {
            throw new BadRequestException(
                ERR_MSG.INVALID(JWT_TYPE.ACCESS_TOKEN),
            );
        }

        await Promise.all([
            this.revokeTokenService.revoke(accessToken),
            this.revokeTokenService.revoke(refreshToken),
        ]);
        return SUCCESSFUL_MSG;
    }

    async refreshToken(input: RefreshTokenInput): Promise<AuthInterface> {
        // Verify accessToken is valid and has not expired - JwtGuard did it.
        const { currentUserId, refreshToken, accessToken } = input;
        const userId = currentUserId.toString();

        // Verify valid token that was issued by the server
        const decoded = await this.jwtService.verifyAsync(refreshToken, {
            complete: false,
        });

        // Validate with class-validator, error catch at global.filter.ts
        await validate(new JwtVerifyDecoded(), decoded);

        // Validate token revoke
        const tokenId = decoded.jti;
        const tokenRevoked = await this.revokeTokenService.isRevoked(tokenId);
        if (tokenRevoked) {
            throw new UnauthorizedException(ERR_MSG.REVOKED_TOKEN);
        }

        // Validate refresh token associated with a valid user account
        if (safeCompare(userId, decoded.sub)) {
            const [newAccessToken, newRefreshToken] = await Promise.all([
                this.signJWT({ type: JWT_TYPE.ACCESS_TOKEN, userId }),
                this.reSignRefreshTokenNearExpiration(
                    Number(decoded.exp),
                    userId,
                    refreshToken,
                ),
                this.revokeTokenService.revoke(accessToken.split(' ')[1]),
            ]);
            return {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
                publicKey: this.publicKey,
            };
        }
        throw new UnauthorizedException(
            ERR_MSG.INVALID(JWT_TYPE.REFRESH_TOKEN),
        );
    }

    async forgotPassword(input: ForgotPasswordInput) {
        const user: Pick<UserInterface, '_id' | 'displayName' | 'email'> =
            await this.userService.getOne({ email: input.email });

        const payload: JwtPayloadInterface = {
            sub: user._id.toString(),
            jti: randomUUID(),
            type: JWT_TYPE.FORGOT_PASSWORD,
        };
        const forgotPasswordToken = await this.jwtService.signAsync(payload);
        const receiver = `${user.displayName} ${user.email}`;
        await this.emailService.sendVerificationEmail({
            to: receiver,
            token: forgotPasswordToken,
            subject: 'Reset Your Password',
            link: `${AUTH_ROUTE}/${FORGOT_PASSWORD_ROUTE}`,
        });

        return SUCCESSFUL_MSG;
    }

    async verifyForgotPassword(
        input: VerifyForgotPasswordInput,
    ): Promise<string> {
        const decoded = await this.jwtService.verifyAsync(input.token, {
            complete: false,
        });
        // Validate with class-validator, error catch at global.filter.ts
        await validate(new JwtVerifyDecoded(), decoded);

        if (decoded.type !== JWT_TYPE.FORGOT_PASSWORD) {
            throw new UnauthorizedException(
                ERR_MSG.INVALID(JWT_TYPE.FORGOT_PASSWORD),
            );
        }

        // Validate request is expires
        const isRevoked = await this.revokeTokenService.isRevoked(decoded.jti);
        if (isRevoked) {
            throw new BadRequestException(
                ERR_MSG.EXPIRES(JWT_TYPE.FORGOT_PASSWORD),
            );
        }

        const [user, hashedPassword] = await Promise.all([
            this.userService.getOne({ _id: decoded.sub }),
            bcrypt.hash(input.newPassword, 10),
            this.revokeTokenService.revoke(input.token),
        ]);

        await this.userService.update(
            { _id: user._id.toString() },
            { password: hashedPassword },
        );

        return SUCCESSFUL_MSG;
    }

    async resetPassword(
        currentUser: UserPassportObjectInterface,
        input: ResetPasswordInput,
    ): Promise<string> {
        const { oldPassword, newPassword } = input;
        const isMatch = await bcrypt.compare(oldPassword, currentUser.password);
        if (!isMatch) {
            throw new BadRequestException(ERR_MSG.MATCH_PASSWORD);
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        await this.userService.update(
            { _id: currentUser._id.toString() },
            { password: hashedNewPassword },
        );
        return SUCCESSFUL_MSG;
    }

    private async validateEmailAndPassword(email: string, password: string) {
        const user: Pick<
            UserEntity,
            '_id' | 'password' | 'refreshToken' | 'isEmailVerified'
        > = await this.userService.getOne({
            email,
        });
        if (user.isEmailVerified === false) {
            throw new UnauthorizedException(ERR_MSG.ACCOUNT_VERIFY);
        }

        // if not found user, throw error in findOne function
        const pwdMatched = await bcrypt.compare(password, user.password);
        if (pwdMatched) {
            return user;
        }
        throw new BadRequestException(ERR_MSG.MATCH_PASSWORD);
    }

    private async signJWT(jwt: SignJwtInterface): Promise<string> {
        const payload: JwtPayloadInterface = {
            sub: jwt.userId,
            jti: randomUUID(),
            type: jwt.type,
        };
        return await this.jwtService.signAsync(payload, jwt.opts);
    }

    private async reSignRefreshTokenNearExpiration(
        exp: number,
        userId: string,
        oldRefreshToken: string,
    ): Promise<string> {
        const expiryTime = exp * MILLISECONDS.ONE_SECOND;
        const currentTime = Date.now();

        if (expiryTime - currentTime < MILLISECONDS.ONE_DAY) {
            const [newToken] = await Promise.all([
                this.signJWT({
                    type: JWT_TYPE.REFRESH_TOKEN,
                    userId,
                    opts: {
                        expiresIn: this.jwtConfig.refreshTokenExpirationTime,
                    },
                }),
                this.revokeTokenService.revoke(oldRefreshToken),
            ]);
            await this.userService.update(
                { _id: userId },
                { refreshToken: newToken },
            );
            return newToken;
        }
        return oldRefreshToken;
    }
}
