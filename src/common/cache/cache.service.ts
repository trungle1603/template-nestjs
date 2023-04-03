import {
    CacheConfig,
    InjectCacheConfig,
    InjectCacheManger,
} from '@common/config/config.cache';
import { Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
    constructor(
        @InjectCacheManger() private readonly cacheManager: Cache,
        @InjectCacheConfig() private readonly cacheConfig: CacheConfig,
    ) {}

    async get<T>(key: string): Promise<T | null> {
        const cachedData = await this.cacheManager.get<T>(key);
        if (cachedData) {
            return cachedData;
        }
        return null;
    }

    async set<T>(
        key: string,
        data: T,
        ttl = this.cacheConfig.ttl,
    ): Promise<void> {
        await this.cacheManager.store.set<T>(key, data, ttl);
    }

    async del(key: string): Promise<void> {
        await this.cacheManager.del(key);
    }

    async delMultiStartWith(search: string) {
        const keys = await this.cacheManager.store.keys(`${search}*`);
        if (keys && keys.length > 0) {
            await this.cacheManager.store.mdel(...keys);
        }
    }

    /**
     *
     * @param name Must be a class name and method name. Example `${UserService.name}_getOne`
     * @param args every argument in function
     * @returns Consistence cache key
     * @example "myFunction_arg1_{"foo":"bar"}_null_undefined_false"
     */
    buildKey(name: string, ...args: any[]): string {
        const argString = args
            .map(function (arg) {
                return JSON.stringify(arg);
            })
            .join('_');
        return `${name}_${argString}`;
    }
}
