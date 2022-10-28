import { ApolloClient, InMemoryCache } from "@apollo/client";

const SERVER_URL = "http://localhost:7000/graphql";
const client = new ApolloClient({
  uri: SERVER_URL,
  cache: new InMemoryCache(),
});

export default client;
