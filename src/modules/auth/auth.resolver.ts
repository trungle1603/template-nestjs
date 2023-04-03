import { CurrentUser } from '@common/decorators/current-user.decorator';
import { Public } from '@common/decorators/public.decorator';
import { Req } from '@common/decorators/req.decorator';
import { RequestExpressInterface } from '@common/interfaces/http-message.interface';
import { UserPassportObjectInterface } from '@modules/user/user.interface';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthEntity } from './auth.entity';
import { AuthService } from './auth.service';
import { ForgotPasswordInput } from './inputs/forgot-password.input';
import { LoginInput } from './inputs/login.input';
import { LogoutInput } from './inputs/logout.input';
import { RefreshTokenInput } from './inputs/refresh-token.input';
import { ResetPasswordInput } from './inputs/reset-password.input';
import { SignUpInput } from './inputs/sign-up.input';
import { VerifyForgotPasswordInput } from './inputs/verify-forgot-password.input';

@Resolver()
export class AuthResolver {
    constructor(private readonly authService: AuthService) {}

    @Public()
    @Mutation(() => AuthEntity)
    async login(@Args('input') input: LoginInput) {
        return this.authService.login(input);
    }

    @Mutation(() => AuthEntity)
    async refreshToken(@Req() req: RequestExpressInterface) {
        return this.authService.refreshToken(new RefreshTokenInput(req));
    }

    /**
     * @returns Successful message
     */
    @Public()
    @Mutation(() => String)
    async signUp(@Args('input') input: SignUpInput) {
        return this.authService.signUp(input);
    }

    /**
     * @returns Successful message
     */
    @Mutation(() => String)
    async logout(@Req() req: RequestExpressInterface) {
        return this.authService.logout(new LogoutInput(req));
    }

    /**
     * @returns Successful message
     */
    @Public()
    @Mutation(() => String)
    async forgotPassword(@Args('input') input: ForgotPasswordInput) {
        return this.authService.forgotPassword(input);
    }

    /**
     * @returns Successful message
     */
    @Public()
    @Mutation(() => String)
    async verifyForgotPassword(
        @Args('input') input: VerifyForgotPasswordInput,
    ) {
        return this.authService.verifyForgotPassword(input);
    }

    /**
     * @returns Successful message
     */
    @Mutation(() => String)
    async resetPassword(
        @CurrentUser() user: UserPassportObjectInterface,
        @Args('input') input: ResetPasswordInput,
    ) {
        return this.authService.resetPassword(user, input);
    }
}
