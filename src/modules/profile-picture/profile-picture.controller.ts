import {
    Controller,
    FileTypeValidator,
    MaxFileSizeValidator,
    ParseFilePipe,
    Post,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserPassportObjectInterface } from '@modules/user/user.interface';
import { ProfilePictureService } from './profile-picture.service';
import { CurrentUser } from '@common/decorators/current-user.decorator';
const oneKB = 1000; // bytes

@Controller('upload/profile-picture')
export class ProfilePictureController {
    constructor(
        private readonly profilePictureService: ProfilePictureService,
    ) {}

    /**
     * File will upload to memory
     * @returns file path
     */
    @Post()
    @UseInterceptors(FileInterceptor('image'))
    async uploadProfilePicture(
        @CurrentUser() user: UserPassportObjectInterface,
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({ maxSize: 200 * oneKB }),
                    new FileTypeValidator({ fileType: /jpeg|jpg|png|svg/ }),
                ],
            }),
        )
        file: Express.Multer.File,
    ) {
        return this.profilePictureService.upload(
            { ...file, author: user._id },
            user,
        );
    }
}
