const { GraphQLError } = require("graphql");
const { PubSub } = require("graphql-subscriptions");
const { assertValidExecutionArguments } = require("graphql/execution/execute");
const axios = require("axios");

const AUTH_API = "http://localhost:3000";
const USER_API = "http://localhost:4000";
const MESSAGES_API = "http://localhost:5000";

const messages = [
  {
    text: "Hi",
    from: "Kate Chopin",
  },
  {
    text: "City of Glass",
    from: "Paul Auster",
  },
];

const pubsub = new PubSub();

const resolvers = {
  Mutation: {
    createMessage: async (parent, { messageInput }) => {
      pubsub.publish("MESSAGE_CREATED", {
        messageCreated: messageInput,
      });

      return messageInput;
    },

    createUser: async (parent, { userInput }, context) => {
      const {
        username,
        password,
        passwordConfirm,
        email,
        firstName,
        lastName,
      } = userInput;

      if (password !== passwordConfirm) {
        throw new GraphQLError("Passwords must match");
      }

      const authRes = axios.post(AUTH_API + "/signup", {
        username,
        password,
      });

      const userRes = axios.post(USER_API + "/user/create", {
        username,
        firstName,
        lastName,
        email,
      });

      try {
        await Promise.all([userRes, authRes]);
      } catch (error) {
        return { success: false, errorMessage: error.message };
      }

      return { success: true };
    },

    login: async (parent, { userInput }) => {
      const res = await axios.post(AUTH_API + "/login", userInput);
      const jwt = res.data.token;

      const { data } = await axios.get(
        USER_API + `/user/?username=${userInput.username}`
      );

      return { ...data, token: jwt };
    },
  },
  Subscription: {
    messageCreated: {
      subscribe: () => pubsub.asyncIterator("MESSAGE_CREATED"),
    },
  },
  Query: {
    messages: () => messages,
  },
};

module.exports = resolvers;
