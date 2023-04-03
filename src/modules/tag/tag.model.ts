import { requiredValidate } from '@common/validations/mongoose.validation';
import { HydratedDocument, Model, Schema } from 'mongoose';
import { TagEntity } from './tag.entity';

export type TagDocument = HydratedDocument<TagEntity>;
export type TagModel = Model<TagDocument>;

export const TagSchema = new Schema<TagDocument>(
    {
        name: {
            type: String,
            text: true,
            trim: true,
            validate: requiredValidate,
        },
        slug: { type: String, unique: true, validate: requiredValidate },
        description: String,
    },
    { timestamps: true },
);
