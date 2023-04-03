import { Roles } from '@common/decorators/role.decorator';
import { ROLE } from '@common/enums/role.enum';
import { Mutation, Resolver } from '@nestjs/graphql';
import { PermissionService } from './permission.service';

@Resolver()
export class PermissionResolver {
    constructor(private readonly permissionService: PermissionService) {}

    /**
     * @returns Successful message
     */
    @Mutation(() => String)
    @Roles(ROLE.ADMIN)
    async generateListPermission() {
        return this.permissionService.generateListPermission();
    }
}
