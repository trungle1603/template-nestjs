import { InputType, PartialType, PickType } from '@nestjs/graphql';
import { CreateCategoryInput } from './create-category.input';

@InputType()
export class FilterGetAllCategoryInput extends PartialType(
    PickType(CreateCategoryInput, ['name'] as const),
) {}
