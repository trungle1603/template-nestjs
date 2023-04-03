import { AnyValue } from '@common/types/any-value.type';

export interface MailOptionInterface {
    to: string;
    subject: string;
    html: string;
}

export type TemplateInfo = Record<string, AnyValue>;
