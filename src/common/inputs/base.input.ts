import { BaseInterface } from '@common/interfaces/base.interface';
import { Field, InputType } from '@nestjs/graphql';
import { IsMongoId } from 'class-validator';
import { GraphQLObjectID } from 'graphql-scalars';

@InputType()
export class BaseInput implements Pick<BaseInterface, '_id'> {
    /**
     * _id is a object id
     */
    @Field(() => GraphQLObjectID)
    @IsMongoId()
    _id: string;
}
