import { CreateUserInput } from '@modules/user/inputs/create-user.input';
import { InputType, PickType } from '@nestjs/graphql';

@InputType()
export class ForgotPasswordInput extends PickType(CreateUserInput, [
    'email',
] as const) {}
