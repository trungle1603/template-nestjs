import { PATTERN } from '@common/constants/pattern.constant';
import { ObjectID } from '@common/types/object-id.type';
import { HideField, InputType } from '@nestjs/graphql';
import { IsDefined, Matches } from 'class-validator';
import { UserInterface } from '../user.interface';
import { ERR_MSG } from '@common/constants/err-msg.constant';

@InputType()
export class CreateUserInput implements Omit<UserInterface, '_id'> {
    /**
     * Only allow letters, numbers, spaces, and hyphens
     * @minLength 2
     * @maxLength 30
     */
    @IsDefined()
    @Matches(PATTERN.STRING_SPACE_NUMBER_HYPHENS, {
        message: ERR_MSG.INVALID('display name'),
    })
    displayName: string;

    /**
     * Starts with one or more characters that are not whitespace or '@', followed by an '@' symbol
     * Then one or more characters that are not whitespace or '@', followed by a '.'
     * And then one or more characters that are not whitespace or '@'
     * @example example@domain.com
     */
    @IsDefined()
    @Matches(PATTERN.EMAIL, { message: ERR_MSG.INVALID('email') })
    email: string;

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
    password: string;

    @HideField()
    roles: ObjectID[];
    @HideField()
    refreshToken: string;
    @HideField()
    isEmailVerified: boolean;
}

/* 
For phoneNumber: 
- Check the length: A phone number should be within a certain range of digits. 
For example, in the US, phone numbers are 10 digits long.

- Check the format: Phone numbers often have a specific format with specific separators, such as dashes or parentheses. 
For example, in the US, phone numbers are commonly formatted as (123) 456-7890.

- Check the country code: If the phone number includes a country code, validate that the code is valid for the country the phone number is from.

- Check for invalid characters: Some phone number formats may include characters that are not allowed, such as letters or special characters.

- Check with an external service: There are services and libraries available that can validate phone numbers using a variety of methods, such as checking against carrier databases or performing number lookups.
*/
