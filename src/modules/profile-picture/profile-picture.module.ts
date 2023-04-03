import { ALIAS } from '@common/enums/alias.enum';
import { UserModule } from '@modules/user/user.module';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProfilePictureController } from './profile-picture.controller';
import { ProfilePictureSchema } from './profile-picture.model';
import { ProfilePictureResolver } from './profile-picture.resolver';
import { ProfilePictureService } from './profile-picture.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: ALIAS.PROFILE_PICTURE, schema: ProfilePictureSchema },
        ]),
        UserModule,
    ],
    providers: [ProfilePictureService, ProfilePictureResolver],
    controllers: [ProfilePictureController],
})
export class ProfilePictureModule {}
