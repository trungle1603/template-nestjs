import { CacheConfig, InjectCacheConfig } from '@common/config/config.cache';
import { CacheOptionsFactory, Injectable } from '@nestjs/common';
import { redisStore } from 'cache-manager-redis-yet';

@Injectable()
export class CacheConfigService implements CacheOptionsFactory {
    constructor(
        @InjectCacheConfig() private readonly cacheConfig: CacheConfig,
    ) {}

    async createCacheOptions() {
        const { ttl, host, port, password } = this.cacheConfig;

        return {
            store: await redisStore({
                socket: { host, port },
                ttl,
                password,
            }),
        };
    }
}
