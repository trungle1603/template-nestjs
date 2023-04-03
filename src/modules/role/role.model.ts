import { ROLE } from '@common/enums/role.enum';
import {
    enumValidator,
    requiredValidate,
} from '@common/validations/mongoose.validation';
import { REQUIRE_PERMISSION } from '@modules/permission/permission.constant';
import { HydratedDocument, Model, Schema } from 'mongoose';
import { RoleInterface } from './role.interface';

export type RoleDocument = HydratedDocument<RoleInterface>;
export type RoleModel = Model<RoleDocument>;

export const RoleSchema = new Schema<RoleDocument>(
    {
        name: {
            type: Number,
            enum: enumValidator(Object.values(ROLE) as number[]),
            unique: true,
            validate: requiredValidate,
        },
        permissions: [
            {
                type: String,
                validate: requiredValidate,
                enum: enumValidator(REQUIRE_PERMISSION),
            },
        ],
    },
    { timestamps: true },
);
