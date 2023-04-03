/* eslint-disable @typescript-eslint/no-var-requires */
'use strict';

require('dotenv').config();
const bcrypt = require('bcrypt');
const crypto = require('node:crypto');
const readline = require('node:readline');
const { stdin: input, stdout: output } = require('node:process');
const rl = readline.createInterface({ input, output });

async function generateKeyDerivation(passphrase) {
    if (!passphrase) {
        throw Error('Missing passphrase');
    }

    const hash = await bcrypt.hash(passphrase, 10);
    const key = crypto
        .createHash('sha256')
        .update(hash)
        .digest('hex')
        .substring(0, 32);

    console.log(
        `
        Your key derivation is: ${key}
        Now you can save it in environment.
        `,
    );
    rl.close();
}

async function generateKeyDerivationWithPrompt() {
    rl.question(
        `
    Generate Key Derivation for Encryption
    
    Recommend rule for passphrase: 
    1. The passphrase should be at least 12 characters long.
    2. The passphrase should contain a combination of uppercase and lowercase letters, numbers, and special characters.
    
    Enter your passphrase: `,
        async (passphrase) => {
            console.log(await generateKeyDerivation(passphrase));

            rl.close();
        },
    );
}

(async function executed() {
    const passphrase = process.env.ENCRYPTION_PASSPHRASE;

    if (passphrase) {
        return await generateKeyDerivation(passphrase);
    } else {
        generateKeyDerivationWithPrompt();
    }
})();
