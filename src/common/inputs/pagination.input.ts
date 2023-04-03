import { SORT_TYPE } from '@common/enums/sort-type.enum';
import { PaginationInterface } from '@common/interfaces/pagination.interface';
import { Field, HideField, InputType, Int } from '@nestjs/graphql';
import { IsDefined, Min } from 'class-validator';
import { SortInput } from './sort.input';

@InputType()
export class PaginationInput implements PaginationInterface {
    @IsDefined()
    @Min(1)
    @Field(() => Int, { defaultValue: 1, name: 'pageNumber' })
    private pageNumber = 1;

    @IsDefined()
    @Min(1)
    @Field(() => Int, { defaultValue: 10, name: 'pageSize' })
    private pageSize = 10;

    @Field(() => SortInput)
    @IsDefined()
    sort: SortInput = { createdAt: SORT_TYPE.ASCENDING };

    @HideField()
    get skip() {
        return (this.pageNumber - 1) * this.pageSize;
    }
    set skip(value: number) {
        this.pageNumber = value;
    }
    @HideField()
    get limit() {
        return this.pageSize;
    }
    set limit(value: number) {
        this.pageNumber = value;
    }
}
