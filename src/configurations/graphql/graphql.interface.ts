import { GraphQLFormattedError } from 'graphql';

export interface CustomGraphQLFormattedErrorInterface
    extends GraphQLFormattedError {
    statusCode?: number;
    extensions?: {
        originalError?: {
            statusCode?: number;
        };
    };
}
