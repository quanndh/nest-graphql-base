import { ApolloDriverConfig } from '@nestjs/apollo';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { GraphQLError } from 'graphql';
import { AuthenticationError } from 'apollo-server-express';
import { User } from 'src/modules/users/entities/user.entity';

const gql: ApolloDriverConfig = {
  autoSchemaFile: true,
  playground: false,
  plugins: [ApolloServerPluginLandingPageLocalDefault()],
  fieldResolverEnhancers: ['guards', 'interceptors'],
  formatError: (error: GraphQLError) => {
    if (
      //@ts-ignore
      error.extensions?.exception?.response?.message === 'Unauthorized' ||
      error.message === 'Unauthorized'
    ) {
      return new AuthenticationError('Unauthorized');
    }
    return error;
  },
  context: ({
    req,
    res,
    connection,
  }: {
    req: Request;
    res: Response;
    connection: { context: Request };
  }) => {
    if (connection) {
      return { req: connection.context, res };
    } else {
      return { req, res };
    }
  },
};

export default () => {
  return {
    port: Number(process.env.PORT) || 3000,
    database: {
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      synchronize: process.env.DATABASE_SYNC === 'true',
      connectTimeoutMS: 10000,
      maxQueryExecutionTime: 5000,
      logging: process.env.DATABASE_LOGGING === 'true',
      type: 'postgres',
      entities: [User],
      logNotifications: true,
      namingStrategy: new SnakeNamingStrategy(),
    },
    gql: gql,
  };
};
