import { AppConfig, InjectAppConfig } from '@common/config/config.app';
import { GlobalFilter } from '@common/filter/global.filter';
import { JwtGuard } from '@common/guards/jwt.guard';
import { RateLimitGuard } from '@common/guards/rate-limit.guard';
import { ArticleModule } from '@modules/article/article.module';
import { AuthModule } from '@modules/auth/auth.module';
import { CategoryModule } from '@modules/category/category.module';
import { EmailModule } from '@modules/email/email.module';
import { GridFsModule } from '@modules/grid-fs/grid-fs.module';
import { ProfilePictureModule } from '@modules/profile-picture/profile-picture.module';
import { RevokeTokenModule } from '@modules/revoke-token/revoke-token.module';
import { RoleModule } from '@modules/role/role.module';
import { TagModule } from '@modules/tag/tag.module';
import { UserModule } from '@modules/user/user.module';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { CacheModule } from 'configurations/cache/cache.module';

import { ConfigurationModule } from './configurations/configuration.module';
import { MemoryUsageMiddleware } from './middlewares/memory-usage.middleware';
import { HealthModule } from './modules/health/health.module';
import { PermissionModule } from './modules/permission/permission.module';

@Module({
    imports: [
        ConfigurationModule,
        CacheModule,
        ArticleModule,
        AuthModule,
        CategoryModule,
        EmailModule,
        GridFsModule,
        HealthModule,
        PermissionModule,
        ProfilePictureModule,
        RevokeTokenModule,
        RoleModule,
        TagModule,
        UserModule,
    ],
    providers: [
        { provide: APP_GUARD, useClass: RateLimitGuard },
        { provide: APP_GUARD, useClass: JwtGuard },
        { provide: APP_FILTER, useClass: GlobalFilter },
    ],
})
export class AppModule {
    constructor(@InjectAppConfig() private appConfig: AppConfig) {}

    configure(consumer: MiddlewareConsumer) {
        if (this.appConfig.isDevelopment) {
            consumer.apply(MemoryUsageMiddleware).forRoutes('*');
        }
    }
}
