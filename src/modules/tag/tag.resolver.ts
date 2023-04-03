import { Public } from '@common/decorators/public.decorator';
import { Roles } from '@common/decorators/role.decorator';
import { ROLE } from '@common/enums/role.enum';
import { BaseInput } from '@common/inputs/base.input';
import { PaginationInput } from '@common/inputs/pagination.input';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateTagInput } from './inputs/create-tag.input';
import { FilterGetAllTagInput } from './inputs/filter-get-all-tag.input';
import { UpdateTagInput } from './inputs/update-tag.input';
import { TagEntity } from './tag.entity';
import { TagService } from './tag.service';

@Roles(ROLE.ADMIN)
@Resolver()
export class TagResolver {
    constructor(private readonly tagService: TagService) {}

    @Mutation(() => TagEntity)
    async createTag(@Args('input') input: CreateTagInput) {
        return this.tagService.create(input);
    }

    @Query(() => [TagEntity])
    @Public()
    async getAllTag(
        @Args('filter', { nullable: true }) filter: FilterGetAllTagInput,
        @Args('pagination', { nullable: true }) pagination: PaginationInput,
    ) {
        return this.tagService.getAll(filter, pagination);
    }

    @Query(() => TagEntity)
    async getOneTag(@Args('filter') filter: BaseInput) {
        return this.tagService.getOne(filter);
    }

    @Mutation(() => TagEntity)
    async updateTag(
        @Args('filter') filter: BaseInput,
        @Args('input', { nullable: false }) input: UpdateTagInput,
    ) {
        return this.tagService.update(filter, input);
    }

    @Mutation(() => String)
    async deleteTag(@Args('filter') filter: BaseInput) {
        return this.tagService.delete(filter);
    }
}
