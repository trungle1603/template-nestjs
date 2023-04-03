import { AppConfig, InjectAppConfig } from '@common/config/config.app';
import { EmailConfig, InjectEmailConfig } from '@common/config/config.mail';
import { QUEUE } from '@common/constants/queue.constant';
import { VerificationEmailInterface } from '@common/interfaces/verification-email.interface';
import { renderTemplate } from '@common/utils/render-template.util';
import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import nodemailer from 'nodemailer';
import { MailOptionInterface } from './email.interface';

@Injectable()
export class EmailService {
    constructor(
        @InjectEmailConfig() private emailConfig: EmailConfig,
        @InjectAppConfig() private readonly appConfig: AppConfig,
        @InjectQueue(QUEUE.PROCESSOR.EMAIL) private readonly emailQueue: Queue,
    ) {}

    async sendEmail(options: MailOptionInterface) {
        const { host, port, secure, auth } = this.emailConfig;
        const { to, subject, html } = options;

        const transporter = nodemailer.createTransport({
            host,
            port,
            secure,
            auth,
            tls: {
                // rejectUnauthorized: false // for self signed certificate
            },
        });

        try {
            const info = await transporter.sendMail({
                from: auth.user,
                to,
                subject,
                html,
            });

            console.log('Message sent: %s', info.messageId);
            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

            // Preview only available when sending through an Ethereal account
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
            // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
        } catch (error) {
            console.error('EmailService', error.message);
        }
    }

    async sendVerificationEmail(input: VerificationEmailInterface) {
        input.token = encodeURIComponent(input.token);
        const link = `http://${this.appConfig.url}/${input.link}?token=${input.token}`;
        const { subject, to } = input;
        const html = await renderTemplate({
            title: subject,
            titleLowercase: subject.toLowerCase(),
            url: link,
        });
        const queueJobData: MailOptionInterface = { to, subject, html };
        await this.emailQueue.add(
            QUEUE.PROCESS_NAME.VERIFICATION_EMAIL,
            queueJobData,
        );
    }
}
