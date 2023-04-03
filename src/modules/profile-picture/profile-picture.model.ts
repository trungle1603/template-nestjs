import { requiredValidate } from '@common/validations/mongoose.validation';
import { HydratedDocument, Model, Schema } from 'mongoose';
import { ProfilePictureInterface } from './profile-picture.interface';

export type ProfilePictureDocument = HydratedDocument<ProfilePictureInterface>;
export type ProfilePictureModel = Model<ProfilePictureDocument>;

export const ProfilePictureSchema = new Schema<ProfilePictureDocument>(
    {
        author: {
            type: Schema.Types.ObjectId,
            validate: requiredValidate,
            unique: true,
        },
        originalname: String,
        mimetype: String,
        size: Number,
        buffer: Schema.Types.Buffer,
    },
    { timestamps: true },
);
