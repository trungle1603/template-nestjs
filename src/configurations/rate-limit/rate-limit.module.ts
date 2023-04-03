import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { RateLimitConfigService } from './rate-limit-config.service';

@Module({
    imports: [
        ThrottlerModule.forRootAsync({
            useClass: RateLimitConfigService,
        }),
    ],
    providers: [RateLimitConfigService],
})
export class RateLimitModule {}
