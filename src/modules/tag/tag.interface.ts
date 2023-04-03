import { BaseInterface } from '@common/interfaces/base.interface';

export interface TagInterface extends BaseInterface {
    name: string;
    slug: string;
    description?: string;
}
