import { PATTERN } from '@common/constants/pattern.constant';
import { HideField, InputType } from '@nestjs/graphql';
import { IsDefined, Matches, MinLength } from 'class-validator';
import { TagInterface } from '../tag.interface';

@InputType()
export class CreateTagInput implements Omit<TagInterface, '_id'> {
    /**
     * Name just accept string and space
     */
    @IsDefined()
    @MinLength(2)
    @Matches(PATTERN.STRING_SPACE, { message: 'accept string and space' })
    name: string;

    @IsDefined()
    @MinLength(2)
    @Matches(PATTERN.STRING_SPACE, { message: 'accept string and space' })
    description?: string;

    @HideField()
    slug: string;
}
