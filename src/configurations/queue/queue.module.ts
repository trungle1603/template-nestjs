import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { QueueConfigService } from './queue-config.service';

@Module({
    imports: [
        BullModule.forRootAsync({
            useClass: QueueConfigService,
        }),
    ],
    providers: [QueueConfigService],
})
export class QueueModule {}
