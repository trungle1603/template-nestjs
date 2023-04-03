import { BaseEntity } from '@common/entities/base.entity';
import { ALIAS } from '@common/enums/alias.enum';
import { ObjectType } from '@nestjs/graphql';
import { TagInterface } from './tag.interface';

@ObjectType(ALIAS.TAG)
export class TagEntity extends BaseEntity implements TagInterface {
    name: string;
    slug: string;
    description?: string;
}
