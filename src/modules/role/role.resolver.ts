import { Roles } from '@common/decorators/role.decorator';
import { ROLE } from '@common/enums/role.enum';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CreateRoleInput } from './inputs/create-role.input';
import { UpdatePermissionRoleInput } from './inputs/update-permission-role.input';
import { RoleEntity } from './role.entity';
import { RoleService } from './role.service';

@Resolver()
@Roles(ROLE.ADMIN)
export class RoleResolver {
    constructor(private readonly roleService: RoleService) {}

    @Mutation(() => RoleEntity)
    async createRole(@Args('input') input: CreateRoleInput) {
        return this.roleService.create(input);
    }

    /**
     *
     * @param roleID - MongoObjectId
     * @param permissions - List permission accept by server
     * @returns Successful message
     */
    @Mutation(() => String)
    async updatePermissionRole(
        @Args('input') input: UpdatePermissionRoleInput,
    ) {
        return this.roleService.updatePermissionRole(input);
    }
}
