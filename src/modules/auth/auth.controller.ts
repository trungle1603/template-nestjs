import { Public } from '@common/decorators/public.decorator';
import { Controller, Get, Query } from '@nestjs/common';
import { AUTH_ROUTE, VERIFY_EMAIL_ROUTE } from './auth.constant';
import { AuthService } from './auth.service';
import { VerificationTokenDto } from './dtos/verification-token.dto';

@Controller(AUTH_ROUTE)
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    /**
     * @returns Successful message
     */
    @Get(VERIFY_EMAIL_ROUTE)
    @Public()
    async verifyEmail(@Query() query: VerificationTokenDto) {
        return this.authService.verifyEmail(query);
    }
}
