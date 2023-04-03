import { GraphQLDefinitionsFactory } from '@nestjs/graphql';
import { join } from 'path';
import { cwd } from 'process';

const definitionsFactory = new GraphQLDefinitionsFactory();
definitionsFactory.generate({
    typePaths: [join(cwd(), 'src/schema.graphql')],
    path: join(cwd(), 'src/schema.graphql.interface.ts'),
    outputAs: 'interface',
});
