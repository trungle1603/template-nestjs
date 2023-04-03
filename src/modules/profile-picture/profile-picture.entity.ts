import { BaseEntity } from '@common/entities/base.entity';
import { ALIAS } from '@common/enums/alias.enum';
import { ObjectID } from '@common/types/object-id.type';
import { Field, ObjectType } from '@nestjs/graphql';
import { GraphQLObjectID } from 'graphql-scalars';
import { ProfilePictureInterface } from './profile-picture.interface';

@ObjectType(ALIAS.PROFILE_PICTURE)
export class ProfilePictureEntity
    extends BaseEntity
    implements ProfilePictureInterface
{
    @Field(() => GraphQLObjectID)
    author: ObjectID;

    originalname: string;
    mimetype: string;
    size: number;
    buffer: string;
}
