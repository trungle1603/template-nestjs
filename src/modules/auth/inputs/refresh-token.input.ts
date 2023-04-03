import { RequestExpressInterface } from '@common/interfaces/http-message.interface';
import { ObjectID } from '@common/types/object-id.type';
import { Field, InputType } from '@nestjs/graphql';
import { IsDefined, IsNotEmpty } from 'class-validator';
import { GraphQLObjectID } from 'graphql-scalars';

@InputType()
export class RefreshTokenInput {
    @Field(() => GraphQLObjectID)
    @IsDefined()
    @IsNotEmpty()
    currentUserId: ObjectID;

    @IsDefined()
    @IsNotEmpty()
    refreshToken: string;

    @IsDefined()
    @IsNotEmpty()
    accessToken: string;

    constructor(req: RequestExpressInterface) {
        this.currentUserId = req?.user._id;
        this.refreshToken = req?.user.refreshToken;
        this.accessToken = req?.headers.authorization as string;
    }
}
