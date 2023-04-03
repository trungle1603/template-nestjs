import { InputType, PartialType, PickType } from '@nestjs/graphql';
import { CreateTagInput } from './create-tag.input';

@InputType()
export class FilterGetAllTagInput extends PartialType(
    PickType(CreateTagInput, ['name'] as const),
) {}
