import { BaseEntity } from '@common/entities/base.entity';
import { ALIAS } from '@common/enums/alias.enum';
import { ObjectType } from '@nestjs/graphql';
import { CategoryInterface } from './category.interface';

@ObjectType(ALIAS.CATEGORY)
export class CategoryEntity extends BaseEntity implements CategoryInterface {
    name: string;
    slug: string;
}
