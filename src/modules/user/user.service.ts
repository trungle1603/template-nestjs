import { CacheService } from '@common/cache/cache.service';
import { SUCCESSFUL_MSG } from '@common/constants/success-msg.constant';
import { ALIAS } from '@common/enums/alias.enum';
import { BaseInput } from '@common/inputs/base.input';
import { PaginationInput } from '@common/inputs/pagination.input';
import { ObjectID } from '@common/types/object-id.type';
import { getQueryRegex } from '@common/utils/get-query-regex.util';
import { UserInterface } from '@modules/user/user.interface';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isNotEmptyObject } from 'class-validator';
import { CreateUserInput } from './inputs/create-user.input';
import { FilterGetAllUserInput } from './inputs/filter-get-all-user.input';
import { FilterGetOneUserInput } from './inputs/filter-get-one-user.input';
import { UpdateUserInput } from './inputs/update-user.input';
import { UserDocument, UserModel } from './user.model';
import { ERR_MSG } from '@common/constants/err-msg.constant';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(ALIAS.USER) private readonly userModel: UserModel,
        private readonly cacheService: CacheService,
    ) {}

    // CREATE
    async create(input: CreateUserInput): Promise<UserDocument> {
        // input has been validated
        const user = await this.userModel.insertMany(input);
        await this.cacheService.delMultiStartWith(UserService.name);
        return user[0];
    }

    createUserModel(input: CreateUserInput): UserDocument {
        return new this.userModel(input);
    }

    // READ
    async getAll(
        filter: FilterGetAllUserInput = {},
        pagination: PaginationInput,
    ): Promise<UserDocument[]> {
        getQueryRegex(filter, 'displayName');
        const { limit, skip, sort } = pagination;
        const cacheKey = this.cacheService.buildKey(
            UserService.name,
            filter,
            limit,
            skip,
            sort,
        );

        let users = await this.cacheService.get<UserDocument[]>(cacheKey);
        if (users) return users;

        users = await this.userModel.find(
            filter,
            {},
            { limit, skip, sort, lean: true, populate: 'roles' },
        );
        await this.cacheService.set<UserDocument[]>(cacheKey, users);
        return users;
    }

    async getOne(filter: FilterGetOneUserInput): Promise<UserDocument> {
        const cacheKey = this.cacheService.buildKey(UserService.name, filter);

        let user = await this.cacheService.get<UserDocument>(cacheKey);
        if (user) return user;

        user = await this.userModel.findOne<UserDocument>(
            filter,
            {},
            { lean: true, populate: 'roles' },
        );
        if (user) {
            await this.cacheService.set<UserDocument>(cacheKey, user);
            return user;
        }

        throw new NotFoundException(ERR_MSG.NOT_FOUND(ALIAS.USER));
    }

    // UPDATE
    async update(
        filter: BaseInput,
        update: UpdateUserInput,
    ): Promise<UserDocument> {
        isNotEmptyObject(filter);

        // Find and update user
        const user = await this.userModel.findOneAndUpdate(
            { _id: filter._id },
            update,
            { new: true, lean: true, populate: 'roles' },
        );
        if (!user) {
            throw new NotFoundException(ERR_MSG.NOT_FOUND(ALIAS.USER));
        }

        // Update cache data
        await this.cacheService.delMultiStartWith(UserService.name);
        return user;
    }

    // DELETE
    async delete(filter: BaseInput): Promise<string> {
        await Promise.all([
            this.userModel.deleteOne({ _id: filter._id }),
            this.cacheService.delMultiStartWith(UserService.name),
        ]);
        return SUCCESSFUL_MSG;
    }

    // Another
    async isExistUser(email: string): Promise<boolean> {
        const user: { _id: ObjectID } | null = await this.userModel.findOne(
            { email },
            { _id: 1 },
            { lean: true },
        );
        return user ? true : false;
    }

    async validateAndVerifyEmail(userId: string): Promise<string> {
        const user: Pick<UserInterface, '_id' | 'isEmailVerified'> =
            await this.getOne({ _id: userId });

        if (user.isEmailVerified) {
            return 'Email already verified';
        }

        await this.update(
            { _id: user._id as string },
            { isEmailVerified: true },
        );
        return SUCCESSFUL_MSG;
    }
}
