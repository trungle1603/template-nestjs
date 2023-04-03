import { Inject, Logger } from '@nestjs/common';
import { ConfigType, registerAs } from '@nestjs/config';
import nodemailer from 'nodemailer';

export const emailConfig = registerAs('mail', async function () {
    if (!process.env.MAIL_USERNAME || !process.env.MAIL_PASSWORD) {
        Logger.warn(
            'Not found config user and password for send mail service. Instead the test account is used',
            'EmailConfig',
        );

        const testAccount = await nodemailer.createTestAccount();

        const { user, pass, smtp } = testAccount;
        return {
            host: smtp.host,
            port: smtp.port,
            secure: smtp.secure,
            auth: { user, pass },
        };
    }

    return {
        host: process.env.MAIL_HOST,
        port: Number(process.env.MAIL_PORT),
        secure: false, // use SSL instead TLS
        auth: {
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD,
        },
    };
});

export type EmailConfig = ConfigType<typeof emailConfig>;
export function InjectEmailConfig() {
    return Inject(emailConfig.KEY);
}
