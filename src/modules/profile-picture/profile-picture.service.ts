import { CacheService } from '@common/cache/cache.service';
import { SUCCESSFUL_MSG } from '@common/constants/success-msg.constant';
import { ALIAS } from '@common/enums/alias.enum';
import { UserPassportObjectInterface } from '@modules/user/user.interface';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { randomUUID } from 'crypto';
import { CreateProfilePictureDto } from './dtos/create-profile-picture.input';
import {
    ProfilePictureDocument,
    ProfilePictureModel,
} from './profile-picture.model';
import { ERR_MSG } from '@common/constants/err-msg.constant';

@Injectable()
export class ProfilePictureService {
    constructor(
        @InjectModel(ALIAS.PROFILE_PICTURE)
        private readonly profilePictureModel: ProfilePictureModel,
        private readonly cacheService: CacheService,
    ) {}

    // Create
    async create(
        input: CreateProfilePictureDto,
    ): Promise<ProfilePictureDocument> {
        const cacheKey = this.cacheService.buildKey(
            ProfilePictureService.name,
            {
                author: input.author.toString(),
            },
        );
        const [profilePicture] = await Promise.all([
            this.profilePictureModel.insertMany(input),
            this.cacheService.del(cacheKey),
        ]);
        return profilePicture[0];
    }

    async upload(
        input: CreateProfilePictureDto,
        currentUser: UserPassportObjectInterface,
    ): Promise<string> {
        input.originalname = `profile-picture-of-${
            currentUser.displayName
        }-${randomUUID()}`;
        let file = await this.getOne(input.author.toString(), {
            throwError: false,
        });

        // resize image
        // await sharp(input.buffer).resize(800, 600).toBuffer();

        if (file) {
            file.originalname = input.originalname;
            file.mimetype = input.mimetype;
            file.size = input.size;
            file.buffer = input.buffer;
            // Update new file
            await this.profilePictureModel.updateOne(
                { author: input.author },
                { ...file },
            );
        } else {
            file = await this.create(input);
        }
        return SUCCESSFUL_MSG;
    }

    // Read
    async getOne(
        author: string,
        { throwError }: { throwError: boolean } = { throwError: true },
    ): Promise<ProfilePictureDocument | null> {
        const query = { author };
        const cacheKey = this.cacheService.buildKey(
            ProfilePictureService.name,
            query,
        );

        let profilePicture =
            await this.cacheService.get<ProfilePictureDocument>(cacheKey);
        if (profilePicture) return profilePicture;

        profilePicture = await this.profilePictureModel.findOne(
            query,
            {},
            { lean: true },
        );
        if (profilePicture) {
            await this.cacheService.set<ProfilePictureDocument>(
                cacheKey,
                profilePicture,
            );
            return profilePicture;
        }

        if (throwError) {
            throw new NotFoundException(
                ERR_MSG.NOT_FOUND(ALIAS.PROFILE_PICTURE),
            );
        }
        return null;
    }

    // Update
}
