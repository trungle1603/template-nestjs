import { CacheService } from '@common/cache/cache.service';
import { SUCCESSFUL_MSG } from '@common/constants/success-msg.constant';
import { ALIAS } from '@common/enums/alias.enum';
import { BaseInput } from '@common/inputs/base.input';
import { PaginationInput } from '@common/inputs/pagination.input';
import { getQueryRegex } from '@common/utils/get-query-regex.util';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import slugify from 'slugify';
import { CategoryDocument, CategoryModel } from './category.model';
import { CreateCategoryInput } from './inputs/create-category.input';
import { FilterGetAllCategoryInput } from './inputs/filter-get-all-category.input';
import { UpdateCategoryInput } from './inputs/update-category.input';
import { ERR_MSG } from '@common/constants/err-msg.constant';

@Injectable()
export class CategoryService {
    constructor(
        @InjectModel(ALIAS.CATEGORY)
        private readonly categoryModel: CategoryModel,
        private readonly cacheService: CacheService,
    ) {}

    // Create
    async create(input: CreateCategoryInput): Promise<CategoryDocument> {
        const category = new this.categoryModel(input);
        category.slug = `${slugify(category.name)}-${category.id}`;
        await category.save();
        await this.cacheService.delMultiStartWith(CategoryService.name);
        return category;
    }

    // Read
    async getAll(
        filter: FilterGetAllCategoryInput = {},
        pagination: PaginationInput,
    ): Promise<CategoryDocument[]> {
        const { limit, skip, sort } = pagination;
        getQueryRegex(filter, 'name');
        const cacheKey = this.cacheService.buildKey(
            CategoryService.name,
            filter,
            limit,
            skip,
            sort,
        );

        let categorys = await this.cacheService.get<CategoryDocument[]>(
            cacheKey,
        );
        if (categorys) return categorys;

        categorys = await this.categoryModel.find(
            filter,
            {},
            { limit, skip, sort, lean: true },
        );
        await this.cacheService.set<CategoryDocument[]>(cacheKey, categorys);
        return categorys;
    }

    async getOne(filter: BaseInput): Promise<CategoryDocument> {
        const cacheKey = this.cacheService.buildKey(
            CategoryService.name,
            filter,
        );

        let category = await this.cacheService.get<CategoryDocument>(cacheKey);
        if (category) return category;

        category = await this.categoryModel.findById(
            filter._id,
            {},
            { lean: true },
        );
        if (category) {
            await this.cacheService.set<CategoryDocument>(cacheKey, category);
            return category;
        }

        throw new NotFoundException(ERR_MSG.NOT_FOUND(ALIAS.CATEGORY));
    }

    // Update
    async update(
        filter: BaseInput,
        input: UpdateCategoryInput,
    ): Promise<CategoryDocument> {
        if (input?.name) {
            input.slug = `${slugify(input.name)}-${filter._id}`;
        }

        const category = await this.categoryModel.findByIdAndUpdate(
            filter._id,
            input,
            {
                new: true,
                lean: true,
            },
        );
        if (!category) {
            throw new NotFoundException(ERR_MSG.NOT_FOUND(ALIAS.CATEGORY));
        }

        await this.cacheService.delMultiStartWith(CategoryService.name);
        return category;
    }

    // Delete
    async delete(filter: BaseInput): Promise<string> {
        await Promise.all([
            this.categoryModel.deleteOne({ _id: filter._id }),
            this.cacheService.delMultiStartWith(CategoryService.name),
        ]);
        return SUCCESSFUL_MSG;
    }
}
