const { GraphQLError } = require("graphql");
const { PubSub, withFilter } = require("graphql-subscriptions");
const axios = require("axios");

const AUTH_API = "http://localhost:3000";
const USER_API = "http://localhost:4000";
const MESSAGES_API = "http://localhost:5000";

const pubsub = new PubSub();

const resolvers = {
  Message: {},

  Mutation: {
    createMessage: async (parent, { messageInput }) => {
      const createdDate = Date.now();

      axios.post(MESSAGES_API + `/message/create`, {
        from: messageInput.from,
        content: messageInput.text,
        conversationId: messageInput.conversationId,
        createdAt: createdDate,
      });

      const { data } = await axios.get(USER_API + `/user/${messageInput.from}`);
      const user = data;
      const messageCreated = {
        ...messageInput,
        authorName: `${user.firstName} ${user.lastName}`,
        createdAt: createdDate,
      };

      pubsub.publish("MESSAGE_CREATED", { messageCreated });

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
        description,
        avatar,
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
        description,
        avatar,
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

    acceptFriend: async (parent, { friendshipInput }) => {
      const { myId, friendId } = friendshipInput;
      await axios.post(USER_API + "/user/connect", {
        id1: myId,
        id2: friendId,
      });

      // Create a conversation with your friend
      await axios.post(MESSAGES_API + "/conversation/create", {
        isOneOnOne: true,
        members: [{ userId: myId }, { userId: friendId }],
      });

      return friendId;
    },
  },
  Subscription: {
    messageCreated: {
      subscribe: withFilter(
        () => {
          return pubsub.asyncIterator(["MESSAGE_CREATED"]);
        },
        (payload, variables) => {
          return true;
        }
      ),
    },
  },
  Query: {
    friends: async (parent, { userId }) => {
      const { data } = await axios.get(USER_API + "/user/friends/" + userId);
      return data;
    },
    messages: async (parent, { conversationId }) => {
      const { data } = await axios.get(
        MESSAGES_API + "/conversation/ofConversation/" + conversationId
      );

      return data;
    },
    conversations: async (parent, { userId }) => {
      const { data } = await axios.get(
        MESSAGES_API + "/conversation/ofUser/" + userId
      );

      // Get all ids for the first members (distinct from me)
      const ids = new Set();
      for (let conversation of data) {
        conversation.members
          .filter((value) => value.userId != userId)
          .filter((value, index) => index <= 3)
          .map((member) => ids.add(member.userId));
      }

      const params = encodeURIComponent(Array.from(ids));
      const res = await axios.get(USER_API + `/user/fromArray/${params}`);
      const users = res.data;

      const idMap = new Map();
      for (let user of users) {
        idMap.set(user._id, {
          ...user,
          name: `${user.firstName} ${user.lastName}`,
        });
      }

      // Reshape the information.
      const goodConversation = data.map((conversation) => {
        let title = conversation.title;
        if (!conversation.title) {
          title = conversation.members
            .filter((conversation) => conversation.userId != userId)
            .filter((conversation, index) => index <= 3)
            .map((member) => idMap.get(member.userId).name)
            .join(", ");
        }

        const avatars = conversation.members
          .filter((conversation) => conversation.userId != userId)
          .filter((conversation, index) => index <= 3)
          .map((member) => idMap.get(member.userId).avatar);

        const message = conversation.message ? conversation.message : "Say Hi!";

        return { ...conversation, title, avatars, message };
      });
      return goodConversation;
    },
  },
};

module.exports = resolvers;
