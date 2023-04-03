import { RequestExpressInterface } from '@common/interfaces/http-message.interface';
import { ObjectID } from '@common/types/object-id.type';
import { Field, InputType } from '@nestjs/graphql';
import { IsDefined, IsNotEmpty } from 'class-validator';
import { GraphQLObjectID } from 'graphql-scalars';

@InputType()
export class LogoutInput {
    @Field(() => GraphQLObjectID)
    @IsDefined()
    @IsNotEmpty()
    currentUserId: ObjectID;

    @IsDefined()
    @IsNotEmpty()
    accessToken: string;

    constructor(req: RequestExpressInterface) {
        this.currentUserId = req?.user._id;
        this.accessToken = req?.headers.authorization as string; // always has because JWTGuard
    }
}
