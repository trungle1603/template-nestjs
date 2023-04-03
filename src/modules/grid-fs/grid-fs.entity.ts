import { BaseEntity } from '@common/entities/base.entity';
import { Field, Int, ObjectType, PickType } from '@nestjs/graphql';
import { GraphQLDateTime } from 'graphql-scalars';
import { GridFsFileInterface } from './grid-fs.interface';

@ObjectType('GridFsFile')
export class GridFsFileEntity
    extends PickType(BaseEntity, ['_id'] as const)
    implements GridFsFileInterface
{
    @Field(() => Int)
    length: number; // byte

    @Field(() => Int)
    chunkSize: number; // bytes

    @Field(() => GraphQLDateTime)
    uploadDate: Date;

    filename: string;
    contentType: string;
}
