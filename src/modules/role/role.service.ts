import { SUCCESSFUL_MSG } from '@common/constants/success-msg.constant';
import { ALIAS } from '@common/enums/alias.enum';
import { ROLE } from '@common/enums/role.enum';
import { ObjectID } from '@common/types/object-id.type';
import { REQUIRE_PERMISSION } from '@modules/permission/permission.constant';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateRoleInput } from './inputs/create-role.input';
import { UpdatePermissionRoleInput } from './inputs/update-permission-role.input';
import { RoleDocument, RoleModel } from './role.model';

@Injectable()
export class RoleService {
    constructor(
        @InjectModel(ALIAS.ROLE) private readonly roleModel: RoleModel,
    ) {}

    // CREATE
    async create(input: CreateRoleInput): Promise<RoleDocument> {
        const role = await this.roleModel.insertMany(input);
        return role[0];
    }

    // READ
    async findRoleIDs(role: ROLE): Promise<ObjectID[]> {
        if (role) {
            return await this.roleModel.find(
                { name: role },
                { _id: 1 },
                { lean: true },
            );
        }
        return [];
    }

    // UPDATE
    async updatePermissionRole(
        input: UpdatePermissionRoleInput,
    ): Promise<string> {
        // $addToSet -  insert unique value to array
        await this.roleModel.updateOne(
            { _id: input.roleId },
            { $addToSet: { permissions: { $each: input.permissions } } },
        );
        return SUCCESSFUL_MSG;
    }

    // DELETE
    async deleteAllPermissionRemoved(): Promise<void> {
        await this.roleModel.updateMany(
            {},
            { $pull: { permissions: { $nin: REQUIRE_PERMISSION } } },
        );
    }
}
