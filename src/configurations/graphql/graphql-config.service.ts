import { AppConfig, InjectAppConfig } from '@common/config/config.app';
import { HttpMessagesInterface } from '@common/interfaces/http-message.interface';
import { ApolloDriverConfig } from '@nestjs/apollo';
import { Injectable } from '@nestjs/common';
import { GqlOptionsFactory } from '@nestjs/graphql';
import { join } from 'path';
import { cwd } from 'process';
import { CustomGraphQLFormattedErrorInterface } from './graphql.interface';

@Injectable()
export class GraphqlConfigService implements GqlOptionsFactory {
    constructor(@InjectAppConfig() private readonly appConfig: AppConfig) {}

    createGqlOptions(): ApolloDriverConfig {
        // const { isDevelopment } = this.appConfig;
        const schemaPath = join(cwd(), 'src/schema.graphql');

        return {
            introspection: true,
            playground: true,
            includeStacktraceInErrorResponses: false,
            csrfPrevention: true,
            cache: 'bounded',
            useGlobalPrefix: true,
            autoSchemaFile: schemaPath, // requires for code first approach

            context: ({ req, res }: HttpMessagesInterface) => ({ req, res }),
            formatError(
                formattedError: CustomGraphQLFormattedErrorInterface,
            ): CustomGraphQLFormattedErrorInterface {
                const statusCode =
                    formattedError.extensions?.originalError?.statusCode || 400;

                return {
                    message: formattedError.message,
                    statusCode: statusCode,
                };
            },
        };
    }
}
