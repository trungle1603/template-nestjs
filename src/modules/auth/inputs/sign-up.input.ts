import { CreateUserInput } from '@modules/user/inputs/create-user.input';
import { InputType } from '@nestjs/graphql';

@InputType()
export class SignUpInput extends CreateUserInput {}
