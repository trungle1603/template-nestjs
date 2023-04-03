import { SORT_TYPE } from '@common/enums/sort-type.enum';
import { SortInterface } from '@common/interfaces/sort.interface';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class SortInput implements SortInterface {
    @Field(() => SORT_TYPE, { defaultValue: SORT_TYPE.ASCENDING })
    createdAt = SORT_TYPE.ASCENDING;
}
