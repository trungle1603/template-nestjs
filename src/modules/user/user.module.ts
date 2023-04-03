import { ALIAS } from '@common/enums/alias.enum';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './user.model';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: ALIAS.USER,
                schema: UserSchema,
            },
        ]),
    ],
    providers: [UserResolver, UserService],
    exports: [UserService],
})
export class UserModule {}
