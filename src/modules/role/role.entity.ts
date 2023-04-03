import { BaseEntity } from '@common/entities/base.entity';
import { ALIAS } from '@common/enums/alias.enum';
import { ROLE } from '@common/enums/role.enum';
import { ObjectType } from '@nestjs/graphql';
import { RoleInterface } from './role.interface';

@ObjectType(ALIAS.ROLE)
export class RoleEntity extends BaseEntity implements RoleInterface {
    name: ROLE;
    permissions: string[];
}
