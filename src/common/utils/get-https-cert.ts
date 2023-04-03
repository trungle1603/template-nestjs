import { HttpsOptions } from '@nestjs/common/interfaces/external/https-options.interface';
import { existsSync } from 'fs';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { cwd } from 'process';

export async function getHttpsCert(): Promise<HttpsOptions | undefined> {
    const certPath = join(cwd(), 'certificates/https');

    const certPrivate = join(certPath, 'private.pem');
    const certPublic = join(certPath, 'public.pem');

    if (existsSync(certPrivate) && existsSync(certPublic)) {
        const [key, cert] = await Promise.all([
            readFile(certPrivate),
            readFile(certPublic),
        ]);
        return { key, cert };
    }
    return undefined;
}
