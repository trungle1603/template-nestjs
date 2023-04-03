import {
    ApolloServerPlugin,
    BaseContext,
    GraphQLRequestListener,
} from '@apollo/server';
import { Plugin } from '@nestjs/apollo';
import { CustomGraphQLFormattedErrorInterface } from '../graphql.interface';

@Plugin()
export class GraphqlResponsePlugin implements ApolloServerPlugin {
    async requestDidStart(): Promise<void | GraphQLRequestListener<BaseContext>> {
        return {
            async willSendResponse({ response }) {
                if (response.body.kind === 'single') {
                    const errors = response.body.singleResult?.errors;

                    if (errors && errors.length > 0) {
                        const error: CustomGraphQLFormattedErrorInterface =
                            errors[0];
                        response.http.status = error.statusCode;
                    }
                }
            },
        };
    }
}
