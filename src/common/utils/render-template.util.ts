import { AnyValue } from '@common/types/any-value.type';
import { readFile } from 'fs/promises';
import Handlebars from 'handlebars';
import { join } from 'path';
import { cwd } from 'process';

type TemplateInfo = Record<string, AnyValue>;

export async function renderTemplate(info: TemplateInfo = {}): Promise<string> {
    const sourcePath = join(cwd(), 'src/views/templates/email.template.hbs');
    const source = await readFile(sourcePath);
    const template = Handlebars.compile(source.toString());
    return template({ ...info });
}
