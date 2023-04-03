import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { EmailQueueProcessor } from './email.queue-processor';
import { EmailService } from './email.service';
import { QUEUE } from '@common/constants/queue.constant';
@Module({
    imports: [
        BullModule.registerQueue({
            name: QUEUE.PROCESSOR.EMAIL,
        }),
    ],
    providers: [EmailService, EmailQueueProcessor],
    exports: [EmailService],
})
export class EmailModule {}
