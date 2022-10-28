const { createServer } = require("http");
const express = require("express");
const cors = require("cors");
const {
  ApolloServerPluginDrainHttpServer,
} = require("@apollo/server/plugin/drainHttpServer");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const { WebSocketServer } = require("ws");
const { useServer } = require("graphql-ws/lib/use/ws");
const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { expressMiddleware } = require("@apollo/server/express4");

const resolvers = require("./resolvers");
const typeDefs = require("./typeDefs");

async function run() {
  // Schema
  const schema = makeExecutableSchema({ typeDefs, resolvers });

  // Create App
  const app = express();
  const httpServer = createServer(app);

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/graphql",
  });

  const serverCleanup = useServer({ schema }, wsServer);

  const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });

  const PORT = 7000;
  await server.start();
  app.use("/graphql", cors(), express.json(), expressMiddleware(server));

  httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

run();
