import {
    BullModuleOptions,
    SharedBullConfigurationFactory,
} from '@nestjs/bull/dist/interfaces';
import { Injectable } from '@nestjs/common';
import { CacheConfig, InjectCacheConfig } from '@common/config/config.cache';

@Injectable()
export class QueueConfigService implements SharedBullConfigurationFactory {
    constructor(@InjectCacheConfig() private cacheConfig: CacheConfig) {}

    createSharedConfiguration(): BullModuleOptions {
        return {
            redis: {
                host: this.cacheConfig.host,
                port: this.cacheConfig.port,
                password: this.cacheConfig.password,
            },
        };
    }
}
