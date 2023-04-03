import { PATTERN } from '@common/constants/pattern.constant';
import { HideField, InputType } from '@nestjs/graphql';
import { IsDefined, Matches, MinLength } from 'class-validator';
import { CategoryInterface } from '../category.interface';

@InputType()
export class CreateCategoryInput implements Omit<CategoryInterface, '_id'> {
    /**
     * Name just accept string and space
     */
    @IsDefined()
    @MinLength(2)
    @Matches(PATTERN.STRING_SPACE, { message: 'accept string and space' })
    name: string;

    @HideField()
    slug: string;
}
