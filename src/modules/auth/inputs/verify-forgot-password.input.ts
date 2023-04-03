import { ERR_MSG } from '@common/constants/err-msg.constant';
import { PATTERN } from '@common/constants/pattern.constant';
import { InputType } from '@nestjs/graphql';
import { IsDefined, IsJWT, Matches } from 'class-validator';

@InputType()
export class VerifyForgotPasswordInput {
    @IsDefined()
    @IsJWT()
    token: string;

    /**
     *   Password must meet the following criteria:
     * - Minimum of 8 characters
     * - Maximum of 64 characters
     * - At least one uppercase letter
     * - At least one lowercase letter
     * - At least one number
     * - At least one special character (!@#$%^&*
     * @minLength 8
     * @maxLength 64
     * */
    @IsDefined()
    @Matches(PATTERN.PASSWORD, { message: ERR_MSG.INVALID('password') })
    newPassword: string;
}
