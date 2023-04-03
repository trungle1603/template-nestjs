import { Query, Resolver } from '@nestjs/graphql';
import { UserPassportObjectInterface } from '@modules/user/user.interface';
import { ProfilePictureEntity } from './profile-picture.entity';
import { ProfilePictureService } from './profile-picture.service';
import { CurrentUser } from '@common/decorators/current-user.decorator';

@Resolver()
export class ProfilePictureResolver {
    constructor(
        private readonly profilePictureService: ProfilePictureService,
    ) {}

    @Query(() => ProfilePictureEntity)
    async getProfilePicture(@CurrentUser() user: UserPassportObjectInterface) {
        return this.profilePictureService.getOne(user._id.toString());
    }
}
