import { BaseInterface } from '@common/interfaces/base.interface';
import { ObjectID } from '@common/types/object-id.type';
import { Field, ObjectType } from '@nestjs/graphql';
import { GraphQLDateTime, GraphQLObjectID } from 'graphql-scalars';

@ObjectType()
export class BaseEntity implements BaseInterface {
    @Field(() => GraphQLObjectID)
    _id: ObjectID;

    @Field(() => GraphQLDateTime, { nullable: true })
    createdAt?: Date;

    @Field(() => GraphQLDateTime, { nullable: true })
    updatedAt?: Date;
}
