import { requiredValidate } from '@common/validations/mongoose.validation';
import { HydratedDocument, Model, Schema } from 'mongoose';
import { CategoryEntity } from './category.entity';

export type CategoryDocument = HydratedDocument<CategoryEntity>;
export type CategoryModel = Model<CategoryDocument>;

export const CategorySchema = new Schema<CategoryDocument>(
    {
        name: {
            type: String,
            text: true,
            trim: true,
            validate: requiredValidate,
        },
        slug: { type: String, unique: true, validate: requiredValidate },
    },
    { timestamps: true },
);
