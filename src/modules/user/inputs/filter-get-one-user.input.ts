import { BaseInput } from '@common/inputs/base.input';
import {
    InputType,
    IntersectionType,
    PartialType,
    PickType,
} from '@nestjs/graphql';
import { CreateUserInput } from './create-user.input';

@InputType()
export class FilterGetOneUserInput extends PartialType(
    IntersectionType(BaseInput, PickType(CreateUserInput, ['email'] as const)),
) {}
