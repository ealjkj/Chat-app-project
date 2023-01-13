require("dotenv").config();

const { createServer } = require("http");
const express = require("express");
const {
  ApolloServerPluginDrainHttpServer,
} = require("@apollo/server/plugin/drainHttpServer");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const { WebSocketServer } = require("ws");
const { useServer } = require("graphql-ws/lib/use/ws");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const cookies = require("cookie-parser");
var { parse } = require("cookie-parse");
const { GraphQLError } = require("graphql");

// My sources
const resolvers = require("./resolvers");
const typeDefs = require("./typeDefs");
const AuthAPI = require("./dataSources/auth-api");
const UserAPI = require("./dataSources/user-api");
const MessagesAPI = require("./dataSources/messages-api");

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

  const serverCleanup = useServer(
    {
      schema,
      context: async (ctx, msg, args) => {
        let user = null;
        const { cache } = server;
        const authAPI = new AuthAPI({ cache });
        const cookie = parse(ctx.extra.request.headers.cookie);
        const token = cookie.token;
        if (token) {
          const authRes = await authAPI.profile(token);
          user = authRes.user;
        }
        return {
          dataSources: {
            authAPI,
            userAPI: new UserAPI({ cache }),
            messagesAPI: new MessagesAPI({ cache }),
          },
          user,
          noTokenError: token ? null : new GraphQLError("NO_TOKEN"),
        };
      },
    },
    wsServer
  );

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

  const PORT = process.env.PORT;
  await server.start();
  app.use(
    "/graphql",
    cookies(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req, res }) => {
        let user = null;
        const { cache } = server;
        const authAPI = new AuthAPI({ cache });
        const { token } = req.cookies;
        if (token) {
          const authRes = await authAPI.profile(token);
          user = authRes.user;
        }
        return {
          req,
          res,
          dataSources: {
            authAPI,
            userAPI: new UserAPI({ cache }),
            messagesAPI: new MessagesAPI({ cache }),
          },
          user,
          noTokenError: token ? null : new GraphQLError("NO_TOKEN"),
        };
      },
    })
  );
  httpServer.listen(PORT);
}

run();
