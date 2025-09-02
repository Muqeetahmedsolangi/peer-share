import { ApolloClient, InMemoryCache } from '@apollo/client';

export const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',  // Backend GraphQL endpoint
  cache: new InMemoryCache(),
});