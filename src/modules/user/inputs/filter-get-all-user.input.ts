import { InputType, PartialType, PickType } from '@nestjs/graphql';
import { CreateUserInput } from './create-user.input';

@InputType()
export class FilterGetAllUserInput extends PartialType(
    PickType(CreateUserInput, [
        'displayName',
        'email',
        'isEmailVerified',
    ] as const),
) {}
