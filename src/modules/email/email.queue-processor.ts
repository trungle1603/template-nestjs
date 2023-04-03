import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { MailOptionInterface } from './email.interface';
import { EmailService } from './email.service';
import { QUEUE } from '@common/constants/queue.constant';

@Processor(QUEUE.PROCESSOR.EMAIL)
export class EmailQueueProcessor {
    constructor(private emailService: EmailService) {}

    @Process(QUEUE.PROCESS_NAME.VERIFICATION_EMAIL)
    async sendVerificationEmail(job: Job<MailOptionInterface>): Promise<void> {
        const { to, subject, html } = job.data;

        await this.emailService.sendEmail({ to, subject, html });
    }
}
