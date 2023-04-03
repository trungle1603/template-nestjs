import {
    CacheModule as CacheNestJSModule,
    Global,
    Module,
} from '@nestjs/common';
import { RedisClientOptions } from 'redis';
import { CacheService } from '@common/cache/cache.service';
import { CacheConfigService } from './cache-config.service';

@Global()
@Module({
    imports: [
        CacheNestJSModule.registerAsync<RedisClientOptions>({
            useClass: CacheConfigService,
        }),
    ],
    providers: [CacheService, CacheConfigService],
    exports: [CacheService],
})
export class CacheModule {}
