import { BaseEntity } from '@common/entities/base.entity';
import { ALIAS } from '@common/enums/alias.enum';
import { RoleEntity } from '@modules/role/role.entity';
import { UserInterface } from '@modules/user/user.interface';
import { HideField, ObjectType } from '@nestjs/graphql';

@ObjectType(ALIAS.USER)
export class UserEntity extends BaseEntity implements UserInterface {
    /**
     * This is url profile picture
     */
    displayName: string;
    email: string;
    roles: RoleEntity[];
    isEmailVerified: boolean;

    @HideField()
    password: string;
    @HideField()
    refreshToken: string;
}
