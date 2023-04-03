import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

const algorithm = 'aes-256-cbc';
const ivLength = 16; // AES block size is 128 bits

export function encrypt(key: string, data: string): string {
    const iv = randomBytes(ivLength);
    const keyBuffer = Buffer.from(key);
    const cipher = createCipheriv(algorithm, keyBuffer, iv);
    let encrypted = cipher.update(data);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
}

export function decrypt(key: string, cipherText: string): string {
    const [ivString, encryptedString] = cipherText.split(':');
    const iv = Buffer.from(ivString, 'hex');
    const keyBuffer = Buffer.from(key);
    const encrypted = Buffer.from(encryptedString, 'hex');
    const decipher = createDecipheriv(algorithm, keyBuffer, iv);
    let decrypted = decipher.update(encrypted);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}
