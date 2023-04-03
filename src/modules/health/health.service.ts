import { Injectable } from '@nestjs/common';
import {
    HealthCheckResult,
    HealthCheckService,
    MemoryHealthIndicator,
} from '@nestjs/terminus';

@Injectable()
export class HealthService {
    constructor(
        private health: HealthCheckService,
        private memory: MemoryHealthIndicator,
    ) {}

    async check(): Promise<HealthCheckResult> {
        return await this.health.check([
            () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
            () => this.memory.checkRSS('memory_rss', 150 * 1024 * 1024),
        ]);
    }
}
