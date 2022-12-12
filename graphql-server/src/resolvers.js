const { GraphQLError } = require("graphql");
const { PubSub, withFilter } = require("graphql-subscriptions");
const axios = require("axios");

const AUTH_API = process.env.AUTH_API;
const USER_API = process.env.USER_API;
const MESSAGES_API = process.env.MESSAGES_API;

const pubsub = new PubSub();

const resolvers = {
  Message: {
    authorName: async ({ from }) => {
      const { data } = await axios.get(USER_API + `/user/${from}`);
      return `${data.firstName} ${data.lastName}`;
    },
    text: (parent) => {
      if (!parent.text) return parent.content;
      return parent.text;
    },
  },

  Conversation: {
    members: async (parent, _, { dataSources }) => {
      const users = await dataSources.userAPI.getUsers(
        parent.members.map((user) => user._id)
      );

      const idMap = new Map();
      for (let user of users) {
        idMap.set(user._id, user);
      }

      return parent.members.map((member) => ({
        ...member,
        ...idMap.get(member.userId),
      }));
    },

    avatars: async (parent, _, { dataSources, user }) => {
      const members = await dataSources.userAPI.getUsers(
        parent.members.map((user) => user._id)
      );
      const avatars = members
        .filter((member) => member._id != user.userId)
        .map(({ avatar }) => avatar)
        .slice(2);
      return avatars;
    },

    title: async (parent, _, { user, dataSources }) => {
      const members = await dataSources.userAPI.getUsers(
        parent.members.map((user) => user._id)
      );

      if (parent.title) return parent.title;
      const title = members
        .filter((member) => member._id != user.userId)
        .filter((member, index) => index <= 3)
        .map((member) => member.firstName + " " + member.lastName)
        .join(", ");

      return title;
    },

    lastMessage: async (parent) => {
      if (parent.lastMessage) return parent.lastMessage;

      return (defaultMessage = {
        from: "none",
        text: "SayHi",
      });
    },

    joinedAt: async ({ members }, _, { user }) => {
      return members.find((member) => member.userId === user.userId)?.joinedAt;
    },
  },

  Mutation: {
    createConversation: async (
      parent,
      { conversationInput },
      { dataSources }
    ) => {
      const conversation = await dataSources.messagesAPI.createConversation({
        ...conversationInput,
        isOneOnOne: false,
        admins: [conversationInput.creatorId],
      });
      return conversation;
    },
    addParticipants: async (
      parent,
      { conversationId, participants },
      { dataSources, user }
    ) => {
      const conversation = await dataSources.messagesAPI.getConversation(
        conversationId
      );
      if (!conversation.admins.includes(user.userId)) return;

      await dataSources.messagesAPI.addParticipants({
        conversationId,
        participants,
      });

      return conversationId;
    },
    createMessage: async (parent, { messageInput }, { user, dataSources }) => {
      const newMessage = {
        from: messageInput.from,
        content: messageInput.text,
        conversationId: messageInput.conversationId,
      };

      const message = await dataSources.messagesAPI.createMessage(newMessage);

      const messageCreated = {
        ...message,
        text: message.content,
      };

      pubsub.publish("MESSAGE_CREATED", { messageCreated });

      return messageInput;
    },

    createUser: async (parent, { userInput }, { dataSources }) => {
      const { password, passwordConfirm, ...user } = userInput;

      try {
        if (password !== passwordConfirm) {
          throw new GraphQLError("Passwords must match");
        }
        const userRes = await dataSources.userAPI.createUser(user);
        const authRes = await dataSources.authAPI.signup({
          username: user.username,
          password,
          userId: userRes._id,
        });
      } catch (error) {
        if (
          error.extensions &&
          error?.extensions.response.body.code === 11000
        ) {
          throw new Error(`User ${user.username} has already been taken`);
        }
        throw new Error(
          "Something went wrong, please try again in a few minutes"
        );
      }

      return { success: true };
    },

    login: async (parent, { userInput }, { req, res, dataSources }) => {
      try {
        const { token } = await dataSources.authAPI.login(userInput);
        res.cookie("token", token, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
        });
        return await dataSources.userAPI.getUserByUsername(userInput.username);
      } catch (error) {
        if (error?.extensions.response.body.error === "INVALID_CREDENTIALS") {
          throw new GraphQLError("Invalid credentials");
        }
      }
    },

    logout: async (parent, args, { req, res }) => {
      res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });

      return { success: true };
    },

    sendFriendRequest: async (parent, { friendshipInput }) => {
      const { myId, friendId } = friendshipInput;

      await axios.post(USER_API + "/user/requestFriendship", {
        sourceId: myId,
        targetId: friendId,
      });

      return friendId;
    },

    acceptFriend: async (parent, { friendshipInput }) => {
      const { myId, friendId } = friendshipInput;
      await axios.post(USER_API + "/user/acceptFriend", {
        targetId: myId,
        sourceId: friendId,
      });

      // Create a conversation with your friend
      await axios.post(MESSAGES_API + "/conversation/create", {
        isOneOnOne: true,
        members: [{ userId: myId }, { userId: friendId }],
      });

      return friendId;
    },

    rejectFriend: async (parent, { friendshipInput }) => {
      const { myId, friendId } = friendshipInput;
      await axios.post(USER_API + "/user/rejectFriend", {
        targetId: myId,
        sourceId: friendId,
      });

      return friendId;
    },

    unfriend: async (parent, { friendId }, { user, dataSources }) => {
      console.log(user.userId, friendId);
      await dataSources.userAPI.unfriend(user.userId, friendId);
      return friendId;
    },

    leaveConversation: async (parent, { myId, conversationId }) => {
      await axios.put(
        MESSAGES_API + "/conversation/leaveConversation/" + conversationId,
        {
          userId: myId,
        }
      );

      return conversationId;
    },

    removeParticipant: async (
      parent,
      { conversationId, participantId },
      { user, dataSources }
    ) => {
      const conversation = await dataSources.messagesAPI.getConversation(
        conversationId
      );
      if (!conversation.admins.includes(user.userId)) return;

      await dataSources.messagesAPI.removeParticipant({
        conversationId,
        participantId,
      });

      return conversationId;
    },

    changeLanguage: async (parent, { language }, { user, dataSources }) => {
      await dataSources.userAPI.editSettings(user.userId, { language });
      return language;
    },
  },
  Subscription: {
    messageCreated: {
      subscribe: withFilter(
        () => {
          return pubsub.asyncIterator(["MESSAGE_CREATED"]);
        },
        ({ messageCreated }, { conversationId }) => {
          return messageCreated.conversationId === conversationId;
        }
      ),
    },
    friendRequestSent: {
      subscribe: withFilter(
        () => {
          return pubsub.asyncIterator(["FRIEND_REQUEST_SENT"]);
        },
        ({ friendRequestSent }, { targetId }) => {
          console.log(friendRequestSent, targetId);
          return true;
        }
      ),
    },
    friendRequestAccepted: {
      subscribe: withFilter(
        () => {
          return pubsub.asyncIterator(["FRIEND_REQUEST_ACCEPTED"]);
        },
        ({ friendRequestSent }, { targetId }) => {
          console.log(friendRequestSent, targetId);
          return true;
        }
      ),
    },
  },
  Query: {
    user: async (parent, args, { dataSources, user, noTokenError }) => {
      if (noTokenError) throw noTokenError;
      return await dataSources.userAPI.getUserByUsername(user.username);
    },
    exists: async (parent, { username, email }, { req, dataSources }) => {
      if (username) {
        const res = await dataSources.userAPI.exists({ username });
        return { username: res.existence };
      }
      if (email) {
        const res = await dataSources.userAPI.exists({ email });
        return { email: res.existence };
      }
    },
    conversation: async (parent, { conversationId }) => {
      const { data } = await axios.get(
        MESSAGES_API + "/conversation/" + conversationId
      );

      return data;
    },
    friends: async (parent, { userId }) => {
      const { data } = await axios.get(USER_API + "/user/friends/" + userId);
      return data;
    },
    messages: async (parent, { conversationId }) => {
      const { data } = await axios.get(
        MESSAGES_API + "/message/ofConversation/" + conversationId
      );

      return data;
    },
    conversations: async (_, __, { dataSources, user }) => {
      const { userId } = user;
      const conversations =
        await dataSources.messagesAPI.getConversationsFromUser(userId);

      return conversations;
    },
    discoveredUsers: async (parent, { search, myId }) => {
      const { data } = await axios.get(
        USER_API + "/user/fromSearch?search=" + search
      );
      const results = data.map((user) => ({
        ...user,
        requestSent: user.friendRequests.includes(myId),
      }));
      return results;
    },
  },
};

module.exports = resolvers;
