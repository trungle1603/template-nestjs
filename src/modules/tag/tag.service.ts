import { CacheService } from '@common/cache/cache.service';
import { SUCCESSFUL_MSG } from '@common/constants/success-msg.constant';
import { ALIAS } from '@common/enums/alias.enum';
import { BaseInput } from '@common/inputs/base.input';
import { PaginationInput } from '@common/inputs/pagination.input';
import { getQueryRegex } from '@common/utils/get-query-regex.util';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import slugify from 'slugify';
import { CreateTagInput } from './inputs/create-tag.input';
import { FilterGetAllTagInput } from './inputs/filter-get-all-tag.input';
import { UpdateTagInput } from './inputs/update-tag.input';
import { TagDocument, TagModel } from './tag.model';
import { ERR_MSG } from '@common/constants/err-msg.constant';

@Injectable()
export class TagService {
    constructor(
        @InjectModel(ALIAS.TAG)
        private readonly tagModel: TagModel,
        private readonly cacheService: CacheService,
    ) {}

    // Create
    async create(input: CreateTagInput): Promise<TagDocument> {
        const tag = new this.tagModel(input);
        tag.slug = `${slugify(tag.name)}-${tag.id}`;
        await tag.save();
        await this.cacheService.delMultiStartWith(TagService.name);
        return tag;
    }

    // Read
    async getAll(
        filter: FilterGetAllTagInput = {},
        pagination: PaginationInput,
    ): Promise<TagDocument[]> {
        const { limit, skip, sort } = pagination;
        getQueryRegex(filter, 'name');
        const cacheKey = this.cacheService.buildKey(
            TagService.name,
            filter,
            limit,
            skip,
            sort,
        );

        let tags = await this.cacheService.get<TagDocument[]>(cacheKey);
        if (tags) return tags;

        tags = await this.tagModel.find(
            filter,
            {},
            { limit, skip, sort, lean: true },
        );
        await this.cacheService.set<TagDocument[]>(cacheKey, tags);
        return tags;
    }

    async getOne(filter: BaseInput): Promise<TagDocument> {
        const cacheKey = this.cacheService.buildKey(TagService.name, filter);

        let tag = await this.cacheService.get<TagDocument>(cacheKey);
        if (tag) return tag;

        tag = await this.tagModel.findById(filter._id, {}, { lean: true });
        if (tag) {
            await this.cacheService.set<TagDocument>(cacheKey, tag);
            return tag;
        }

        throw new NotFoundException(ERR_MSG.NOT_FOUND(ALIAS.TAG));
    }

    // Update
    async update(
        filter: BaseInput,
        input: UpdateTagInput,
    ): Promise<TagDocument> {
        if (input?.name) {
            input.slug = `${slugify(input.name)}-${filter._id}`;
        }

        const tag = await this.tagModel.findByIdAndUpdate(filter._id, input, {
            new: true,
            lean: true,
        });
        if (!tag) {
            throw new NotFoundException(ERR_MSG.NOT_FOUND(ALIAS.TAG));
        }

        await this.cacheService.delMultiStartWith(TagService.name);
        return tag;
    }

    // Delete
    async delete(filter: BaseInput): Promise<string> {
        await Promise.all([
            this.tagModel.deleteOne({ _id: filter._id }),
            this.cacheService.delMultiStartWith(TagService.name),
        ]);
        return SUCCESSFUL_MSG;
    }
}
