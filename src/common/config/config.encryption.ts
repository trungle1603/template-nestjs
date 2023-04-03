import { ERR_MSG } from '@common/constants/err-msg.constant';
import { Inject, InternalServerErrorException } from '@nestjs/common';
import { ConfigType, registerAs } from '@nestjs/config';

export const encryptionConfig = registerAs('encryption', function () {
    const passphrase = process.env.ENCRYPTION_PASSPHRASE;
    const keyDerivation = process.env.ENCRYPTION_KEY_DERIVATION;

    if (!passphrase) {
        console.warn(
            'Missing passphrase used to generate key derivation for encryption',
        );
    }
    if (!keyDerivation) {
        throw new InternalServerErrorException(
            ERR_MSG.MISSING('Missing key derivation for encryption') +
                `. Please use 'yarn run gen:key-derivation' to obtain a key derivation and save it in the environment`,
        );
    }

    return { keyDerivation, passphrase };
});

export type EncryptionConfig = ConfigType<typeof encryptionConfig>;
export function InjectEncryptionConfig() {
    return Inject(encryptionConfig.KEY);
}
