import { Injectable } from '@nestjs/common';
import {
    MongooseModuleOptions,
    MongooseOptionsFactory,
} from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { AppConfig, InjectAppConfig } from '@common/config/config.app';
import { DbConfig, InjectDbConfig } from '@common/config/config.db';

@Injectable()
export class DatabaseConfigService implements MongooseOptionsFactory {
    constructor(
        @InjectDbConfig() private readonly dbConfig: DbConfig,
        @InjectAppConfig() private readonly appConfig: AppConfig,
    ) {
        mongoose.set('debug', this.appConfig.isDevelopment);
    }

    createMongooseOptions(): MongooseModuleOptions {
        return { uri: this.dbConfig.uri };
    }
}
