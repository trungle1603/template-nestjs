import { HydratedDocument, Model, Schema } from 'mongoose';
import { RevokeTokenInterface } from './revoke-token.interface';
import { requiredValidate } from '@common/validations/mongoose.validation';

export type RevokeTokenDocument = HydratedDocument<RevokeTokenInterface>;
export type RevokeTokenModel = Model<RevokeTokenDocument>;

export const RevokeTokenSchema = new Schema<RevokeTokenDocument>(
    {
        jti: { type: String, validate: requiredValidate },
        exp: Number,
    },
    { timestamps: true },
);
