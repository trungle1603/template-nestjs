import { Roles } from '@common/decorators/role.decorator';
import { ROLE } from '@common/enums/role.enum';
import { BaseInput } from '@common/inputs/base.input';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GridFsFileEntity } from './grid-fs.entity';
import { GridFsService } from './grid-fs.service';

@Roles(ROLE.ADMIN)
@Resolver()
export class GridFsResolver {
    constructor(private readonly gridFsService: GridFsService) {}

    @Query(() => GridFsFileEntity)
    async getGridFsFile(@Args('args') { _id }: BaseInput) {
        return this.gridFsService.getGridFsFile(_id);
    }

    @Mutation(() => String)
    async deleteGridFsFile(@Args('args') { _id }: BaseInput) {
        return this.gridFsService.deleteFile(_id);
    }
}
