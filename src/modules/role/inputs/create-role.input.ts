import { ROLE } from '@common/enums/role.enum';
import { InputType } from '@nestjs/graphql';
import { IsDefined } from 'class-validator';
import { RoleInterface } from '../role.interface';

@InputType()
export class CreateRoleInput implements Omit<RoleInterface, '_id'> {
    @IsDefined()
    name: ROLE;

    @IsDefined({ each: true })
    permissions: string[];
}
