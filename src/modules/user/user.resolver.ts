import { CurrentUser } from '@common/decorators/current-user.decorator';
import { Roles } from '@common/decorators/role.decorator';
import { ROLE } from '@common/enums/role.enum';
import { BaseInput } from '@common/inputs/base.input';
import { PaginationInput } from '@common/inputs/pagination.input';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateUserInput } from './inputs/create-user.input';
import { FilterGetAllUserInput } from './inputs/filter-get-all-user.input';
import { FilterGetOneUserInput } from './inputs/filter-get-one-user.input';
import { UpdateUserInput } from './inputs/update-user.input';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';

@Roles(ROLE.ADMIN)
@Resolver()
export class UserResolver {
    constructor(private readonly userService: UserService) {}

    @Mutation(() => UserEntity)
    async createUser(@Args('input') input: CreateUserInput) {
        return this.userService.create(input);
    }

    @Query(() => [UserEntity])
    async getAllUser(
        @Args('filter', { nullable: true })
        filter: FilterGetAllUserInput,
        @Args('pagination', { nullable: true }) pagination: PaginationInput,
    ) {
        return this.userService.getAll(filter, pagination);
    }

    @Query(() => UserEntity)
    async getOneUser(@Args('filter') filter: FilterGetOneUserInput) {
        return this.userService.getOne(filter);
    }

    @Query(() => UserEntity)
    async getMyInformation(@CurrentUser() user: UserEntity) {
        return user;
    }

    @Mutation(() => UserEntity)
    async updateUser(
        @Args('filter') filter: BaseInput,
        @Args('input', { nullable: false }) input: UpdateUserInput,
    ) {
        return this.userService.update(filter, input);
    }
}
