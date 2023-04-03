import { ObjectID } from '@common/types/object-id.type';
import { Field, InputType, PickType } from '@nestjs/graphql';
import { IsDefined } from 'class-validator';
import { GraphQLObjectID } from 'graphql-scalars';
import { CreateRoleInput } from './create-role.input';

@InputType()
export class UpdatePermissionRoleInput extends PickType(CreateRoleInput, [
    'permissions',
] as const) {
    @Field(() => GraphQLObjectID)
    @IsDefined()
    roleId: ObjectID;
}
