import { Inject } from '@nestjs/common';
import { ConfigType, registerAs } from '@nestjs/config';

export const dbConfig = registerAs('database', function () {
    const { DB_PROTOCOL, DB_USERNAME, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } =
        process.env;

    return {
        protocol: (DB_PROTOCOL || 'mongodb').toLowerCase(),
        user: DB_USERNAME,
        pass: DB_PASSWORD,
        host: DB_HOST || '127.0.0.1',
        port: DB_PORT || '27017',
        dbName: DB_NAME || 'base-app',

        get uri(): string {
            if (this.user && this.pass) {
                return `${this.protocol}://${this.user}:${this.pass}@${this.host}:${this.port}/${this.dbName}`;
            }

            return `${this.protocol}://${this.host}:${this.port}/${this.dbName}`;
        },
    };
});

export type DbConfig = ConfigType<typeof dbConfig>;
export function InjectDbConfig() {
    return Inject(dbConfig.KEY);
}
