import { createHash } from 'crypto';

export function safeCompare(str1: string, str2: string) {
    const hash1 = createHash('sha256').update(str1).digest('hex');
    const hash2 = createHash('sha256').update(str2).digest('hex');
    return hash1 === hash2;
}
