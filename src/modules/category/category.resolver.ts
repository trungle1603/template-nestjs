import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateCategoryInput } from './inputs/create-category.input';
import { FilterGetAllCategoryInput } from './inputs/filter-get-all-category.input';
import { UpdateCategoryInput } from './inputs/update-category.input';
import { CategoryEntity } from './category.entity';
import { CategoryService } from './category.service';
import { Roles } from '@common/decorators/role.decorator';
import { Public } from '@common/decorators/public.decorator';
import { ROLE } from '@common/enums/role.enum';
import { PaginationInput } from '@common/inputs/pagination.input';
import { BaseInput } from '@common/inputs/base.input';

@Roles(ROLE.ADMIN)
@Resolver()
export class CategoryResolver {
    constructor(private readonly categoryService: CategoryService) {}

    @Mutation(() => CategoryEntity)
    async createCategory(@Args('input') input: CreateCategoryInput) {
        return this.categoryService.create(input);
    }

    @Query(() => [CategoryEntity])
    @Public()
    async getAllCategory(
        @Args('filter', { nullable: true }) filter: FilterGetAllCategoryInput,
        @Args('pagination', { nullable: true }) pagination: PaginationInput,
    ) {
        return this.categoryService.getAll(filter, pagination);
    }

    @Query(() => CategoryEntity)
    async getOneCategory(@Args('filter') filter: BaseInput) {
        return this.categoryService.getOne(filter);
    }

    @Mutation(() => CategoryEntity)
    async updateCategory(
        @Args('filter') filter: BaseInput,
        @Args('input', { nullable: false }) input: UpdateCategoryInput,
    ) {
        return this.categoryService.update(filter, input);
    }

    @Mutation(() => String)
    async deleteCategory(@Args('filter') filter: BaseInput) {
        return this.categoryService.delete(filter);
    }
}
