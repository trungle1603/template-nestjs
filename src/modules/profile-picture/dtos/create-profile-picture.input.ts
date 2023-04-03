import { ObjectID } from '@common/types/object-id.type';
import { ApiHideProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, Matches, Max } from 'class-validator';
import { ProfilePictureInterface } from '../profile-picture.interface';

export class CreateProfilePictureDto
    implements Omit<ProfilePictureInterface, '_id'>
{
    @ApiHideProperty()
    author: ObjectID;

    @IsDefined()
    @Matches(/jpeg|jpg|png|svg/)
    mimetype: string;

    @IsDefined()
    @Max(200 * 1000)
    size: number;

    @IsDefined()
    buffer: Buffer;

    @IsDefined()
    @IsNotEmpty()
    originalname: string;
}
