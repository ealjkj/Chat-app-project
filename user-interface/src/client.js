import { split, HttpLink } from "@apollo/client";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";
import { createClient } from "graphql-ws";

const SERVER_URL = "http://localhost:7000/graphql";
const WS_URL = "ws://localhost:7000/graphql";

const httpLink = new HttpLink({
  uri: SERVER_URL,
});

const wsLink = new GraphQLWsLink(
  createClient({
    url: WS_URL,
  })
);

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

export default client;
