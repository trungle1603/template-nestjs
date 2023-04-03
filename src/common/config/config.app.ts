import { ERR_MSG } from '@common/constants/err-msg.constant';
import { Inject, InternalServerErrorException } from '@nestjs/common';
import { ConfigType, registerAs } from '@nestjs/config';

export const appConfig = registerAs('app', async function () {
    const { APP_DOMAIN, APP_PORT, NODE_ENV, APP_API_KEY } = process.env;

    if (!APP_API_KEY) {
        throw new InternalServerErrorException(
            ERR_MSG.MISSING('api key') + '. Get it with: yarn run gen:encrypt',
        );
    }

    return {
        nodeEnv: NODE_ENV,
        domain: APP_DOMAIN || 'localhost',
        port: Number(APP_PORT) || 3000,
        apiKey: APP_API_KEY,
        globalPrefix: process.env.APP_GLOBAL_PREFIX || 'api',

        get url() {
            return `${this.domain}:${this.port}/${this.globalPrefix}`;
        },
        get isDevelopment() {
            return this.nodeEnv === 'development' ? true : false;
        },
    };
});

export type AppConfig = ConfigType<typeof appConfig>;
export function InjectAppConfig() {
    return Inject(appConfig.KEY);
}
