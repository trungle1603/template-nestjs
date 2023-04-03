import { MILLISECONDS } from '@common/enums/millisecond.enum';
import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { ConfigType, registerAs } from '@nestjs/config';

export const cacheConfig = registerAs('cache', function () {
    const { CACHE_HOST, CACHE_PORT, CACHE_PASSWORD, CACHE_TTL } = process.env;

    return {
        host: CACHE_HOST || 'localhost',
        port: Number(CACHE_PORT) || 6379,
        password: CACHE_PASSWORD,
        ttl: Number(CACHE_TTL) || MILLISECONDS.ONE_MINUTE,
    };
});

export type CacheConfig = ConfigType<typeof cacheConfig>;
export const InjectCacheConfig = function () {
    return Inject(cacheConfig.KEY);
};
export function InjectCacheManger() {
    return Inject(CACHE_MANAGER);
}
