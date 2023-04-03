import { SortInterface } from './sort.interface';

export interface PaginationInterface {
    skip: number;
    limit: number;
    sort: SortInterface;
}
