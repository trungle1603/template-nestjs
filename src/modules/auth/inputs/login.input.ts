import { CreateUserInput } from '@modules/user/inputs/create-user.input';
import { InputType, PickType } from '@nestjs/graphql';

@InputType()
export class LoginInput extends PickType(CreateUserInput, [
    'email',
    'password',
] as const) {}
