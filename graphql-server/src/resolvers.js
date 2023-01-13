const { GraphQLError } = require("graphql");
const { PubSub, withFilter } = require("graphql-subscriptions");
const axios = require("axios");

const USER_API = process.env.USER_API;
const MESSAGES_API = process.env.MESSAGES_API;

const pubsub = new PubSub();

const resolvers = {
  Message: {
    authorName: async ({ from }, args, { user, dataSources }) => {
      const data = await dataSources.userAPI.getUser(from);

      return `${data.firstName} ${data.lastName}`;
    },
    text: (parent) => {
      if (!parent.text) return parent.content;
      return parent.text;
    },
  },

  User: {
    username: async (parent, args, context) => {
      return parent.username;
    },
  },

  Conversation: {
    members: async (parent, _, { dataSources }) => {
      const users = await dataSources.userAPI.getUsers(
        parent.members.map((user) => user.userId)
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
        parent.members.map((user) => user.userId)
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

        if (password.length > 20) {
          throw new GraphQLError("Password is longer than 20 characters");
        }
        const userRes = await dataSources.userAPI.createUser(user);

        await dataSources.authAPI.signup({
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

    sendFriendRequest: async (
      parent,
      { friendshipInput },
      { user, dataSources }
    ) => {
      const { friendId } = friendshipInput;

      const friendRequest = {
        sourceId: user.userId,
        targetId: friendId,
      };

      const sourceUser = await dataSources.userAPI.getUser(user.userId);
      await dataSources.userAPI.sendFriendRequest(friendRequest);

      pubsub.publish(`FRIEND_REQUEST_SENT:${friendId}`, {
        friendRequestSent: sourceUser,
      });

      return friendId;
    },

    acceptFriend: async (parent, { friendId }, { dataSources, user }) => {
      const targetUser = await dataSources.userAPI.getUser(user.userId);

      await dataSources.userAPI.acceptFriend({
        targetId: user.userId,
        sourceId: friendId,
      });

      const conversations =
        await dataSources.messagesAPI.getConversationsFromUser(user.userId);

      const conversationCreated = conversations.find((conv) => {
        if (!conv.isOneOnOne) return false;
        const firstMemberIsUser = conv.members[0].userId === friendId;
        const secondMemberIsUser = conv.members[1].userId === friendId;

        return firstMemberIsUser || secondMemberIsUser;
      });

      if (!conversationCreated) {
        // Create a conversation with your friend
        await dataSources.messagesAPI.createConversation({
          isOneOnOne: true,
          members: [{ userId: user.userId }, { userId: friendId }],
        });
      }

      pubsub.publish(`FRIEND_REQUEST_ACCEPTED:${friendId}`, {
        friendRequestAccepted: targetUser,
      });

      return friendId;
    },

    rejectFriend: async (parent, { friendId }, { user, dataSources }) => {
      await dataSources.userAPI.rejectFriend({
        targetId: user.userId,
        sourceId: friendId,
      });
      return friendId;
    },

    unfriend: async (parent, { friendId }, { user, dataSources }) => {
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
        (_, { conversationId }) => {
          return pubsub.asyncIterator(["MESSAGE_CREATED"]);
        },
        ({ messageCreated }, { conversationId }, { user }) => {
          return messageCreated.conversationId === conversationId;
        }
      ),
    },
    friendRequestSent: {
      subscribe: withFilter(
        (_, __, { user }) => {
          return pubsub.asyncIterator([`FRIEND_REQUEST_SENT:${user.userId}`]);
        },
        ({ friendRequestSent }, { targetId }, { user }) => {
          return true;
        }
      ),
    },
    friendRequestAccepted: {
      subscribe: withFilter(
        (_, __, { user }) => {
          return pubsub.asyncIterator([
            `FRIEND_REQUEST_ACCEPTED:${user.userId}`,
          ]);
        },
        ({ friendRequestSent }, { targetId }) => {
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
    conversation: async (parent, { conversationId }, { user, dataSources }) => {
      const conversation = await dataSources.userAPI.getConversation(
        conversationId
      );

      const isMember = conversation.members.find(
        (member) => member.userId === user.userId
      );

      if (!isMember) throw GraphQLError("Not part of the conversation");

      return conversation;
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
