/* eslint-disable @typescript-eslint/no-var-requires */
'use strict';
const crypto = require('crypto');
require('dotenv').config();

(async function init() {
    const inputKey = process.env.ENCRYPTION_KEY_DERIVATION;
    if (!inputKey) {
        throw new Error(
            'Missing key-derivation. Run yarn gen:key-derivation to get it',
        );
    }

    const data = process.env.APP_CLIENT_ID;

    const algorithm = 'aes-256-cbc';
    const ivLength = 16;

    const iv = crypto.randomBytes(ivLength);
    const key = Buffer.from(inputKey);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(data);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    console.log(`${iv.toString('hex')}:${encrypted.toString('hex')}`);
})();
