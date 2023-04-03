import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { GraphqlConfigService } from './graphql-config.service';
import { GraphqlResponsePlugin } from './plugins/response.plugin';

@Module({
    imports: [
        GraphQLModule.forRootAsync<ApolloDriverConfig>({
            driver: ApolloDriver,
            useClass: GraphqlConfigService,
        }),
    ],
    providers: [GraphqlResponsePlugin, GraphqlConfigService],
})
export class GraphqlModule {}
