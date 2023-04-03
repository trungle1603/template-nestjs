import { registerEnumType } from '@nestjs/graphql';

export enum ARTICLE_STATUS {
    PENDING,
    PUBLISHED,
    REJECT,
    ARCHIVED,
}
registerEnumType(ARTICLE_STATUS, { name: 'ArticleStatusEnum' });
