import { appConfig } from '@common/config/config.app';
import { cacheConfig } from '@common/config/config.cache';
import { cookieConfig } from '@common/config/config.cookie';
import { dbConfig } from '@common/config/config.db';
import { encryptionConfig } from '@common/config/config.encryption';
import { jwtConfig } from '@common/config/config.jwt';
import { emailConfig } from '@common/config/config.mail';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { DatabaseModule } from './database/database.module';
import { GraphqlModule } from './graphql/graphql.module';
import { QueueModule } from './queue/queue.module';
import { RateLimitModule } from './rate-limit/rate-limit.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: ['.env', '.env.production', '.env.example'],
            isGlobal: true,
            load: [
                appConfig,
                cacheConfig,
                cookieConfig,
                dbConfig,
                encryptionConfig,
                jwtConfig,
                emailConfig,
            ],
        }),
        DatabaseModule,
        GraphqlModule,
        QueueModule,
        RateLimitModule,
        ScheduleModule.forRoot(),
    ],
})
export class ConfigurationModule {}
