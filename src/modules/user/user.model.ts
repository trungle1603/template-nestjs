import {
    matchValidator,
    requiredValidate,
    requiredValidator,
} from '@common/validations/mongoose.validation';
import { HydratedDocument, Model, Schema } from 'mongoose';
import { UserEntity } from './user.entity';
import { PATTERN } from '@common/constants/pattern.constant';
import { ALIAS } from '@common/enums/alias.enum';
import { ERR_MSG } from '@common/constants/err-msg.constant';

export type UserDocument = HydratedDocument<UserEntity>;
export type UserModel = Model<UserDocument>;

export const UserSchema = new Schema<UserDocument>(
    {
        // phoneNumber: String,
        displayName: {
            type: String,
            text: true,
            trim: true,
            validate: [
                {
                    validator: (val: string) =>
                        matchValidator(
                            val,
                            PATTERN.STRING_SPACE_NUMBER_HYPHENS,
                        ),
                    msg: ERR_MSG.INVALID('display name'),
                },
                {
                    validator: (val: string) => requiredValidator(val),
                    msg: ERR_MSG.REQUIRED('{VALUE}'),
                },
            ],
        },
        email: {
            type: String,
            unique: true,
            trim: true,
            validate: [
                {
                    validator: (val: string) =>
                        matchValidator(val, PATTERN.EMAIL),
                    msg: ERR_MSG.INVALID('email'),
                },
                {
                    validator: (val: string) => requiredValidator(val),
                    msg: ERR_MSG.REQUIRED('{VALUE}'),
                },
            ],
        },
        password: {
            type: String,
            validate: requiredValidate,
        },
        roles: [
            {
                type: Schema.Types.ObjectId,
                ref: ALIAS.ROLE,
                validate: requiredValidate,
            },
        ],
        refreshToken: {
            type: String,
            default: 'token~',
            validate: requiredValidate,
        },
        isEmailVerified: {
            type: Boolean,
            default: false,
            validate: requiredValidate,
        },
    },
    { timestamps: true },
);
