import { registerEnumType } from '@nestjs/graphql';

export enum SORT_TYPE {
    ASCENDING = 1,
    DESCENDING = -1,
}
registerEnumType(SORT_TYPE, { name: 'SortTypeEnum' });
