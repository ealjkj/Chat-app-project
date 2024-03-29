import { split, HttpLink } from "@apollo/client";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";
import { createClient } from "graphql-ws";

const SERVER_URL = "/graphql";


const WS_URL =
  window.location.protocol === "http:"
    ? `ws://${window.location.host}/graphqlSubs`
    : `wss://${window.location.host}/graphqlSubs`;

const httpLink = new HttpLink({
  uri: SERVER_URL,
  credentials: "same-origin",
});

const wsLink = new GraphQLWsLink(
  createClient({
    url: WS_URL,
    crendentials: "same-origin",
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
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          conversations: {
            merge(existing = [], incoming) {
              return incoming;
            },
          },

          friends: {
            merge(existing = [], incoming) {
              return incoming;
            },
          },

          discoveredUsers: {
            merge(existing = [], incoming) {
              return incoming;
            },
          },
        },
      },
    },
  }),
});

export default client;
