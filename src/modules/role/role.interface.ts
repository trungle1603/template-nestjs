import { BaseEntity } from '@common/entities/base.entity';
import { ROLE } from '@common/enums/role.enum';

export interface RoleInterface extends BaseEntity {
    name: ROLE;
    permissions: string[];
}
