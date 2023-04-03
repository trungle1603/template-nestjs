import { Injectable } from '@nestjs/common';
import {
    ThrottlerModuleOptions,
    ThrottlerOptionsFactory,
} from '@nestjs/throttler';

@Injectable()
export class RateLimitConfigService implements ThrottlerOptionsFactory {
    createThrottlerOptions():
        | ThrottlerModuleOptions
        | Promise<ThrottlerModuleOptions> {
        return {
            ttl: 60, // seconds
            limit: 10,
            ignoreUserAgents: [
                /googlebot/,
                /bingbot/,
                /ia_archiver/,
                /facebot/,
            ],
        };
    }
}
