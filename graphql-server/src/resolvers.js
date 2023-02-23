const { GraphQLError } = require("graphql");
const { PubSub, withFilter } = require("graphql-subscriptions");
const logger = require("./logger");
const { removeDuplicates } = require("./utils");
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

      const me = members.find((member) => member._id === user.userId);

      const title = members
        .filter((member) => member._id !== user.userId)
        .filter((member, index) => index <= 1)
        .map((member) => member.firstName + " " + member.lastName)
        .join(", ");

      if (parent.isOneOnOne) return title;

      if (members.length === 1) return `${me.firstName} ${me.lastName}`;

      if (members.length > 3)
        return `${title}, ${me.firstName} ${me.lastName}, ...`;

      return `${title}, ${me.firstName} ${me.lastName}`;
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
      { user, dataSources }
    ) => {
      const userIsPart = conversationInput.members.some(
        (member) => member.userId === user.userId
      );

      if (!userIsPart) {
        throw new GraphQLError("USER_NOT_PART");
      }

      const { friends } = await dataSources.userAPI.getUser(user.userId);
      const aMemberIsNotFriend = conversationInput.members.some(
        (member) =>
          !friends.includes(member.userId) && member.userId !== user.userId
      );

      if (aMemberIsNotFriend) {
        throw new GraphQLError("INVALID_MEMBERS");
      }
      const conversation = await dataSources.messagesAPI.createConversation({
        ...conversationInput,
        members: removeDuplicates(conversationInput.members),
        isOneOnOne: false,
        admins: [user.userId],
      });

      pubsub.publish("ADDED_TO_CONVERSATION", {
        addedToConversation: conversation,
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

      const { friends } = await dataSources.userAPI.getUser(user.userId);
      const aParticipantIsNotFriend = participants.some(
        (participant) => !friends.includes(participant)
      );
      if (aParticipantIsNotFriend) return;

      await dataSources.messagesAPI.addParticipants({
        conversationId,
        participants: Array.from(new Set(participants)),
      });

      pubsub.publish("ADDED_TO_CONVERSATION", {
        addedToConversation: conversation,
      });

      return conversationId;
    },
    createMessage: async (parent, { messageInput }, { user, dataSources }) => {
      const newMessage = {
        from: user.userId,
        content: messageInput.text,
        conversationId: messageInput.conversationId,
      };

      const message = await dataSources.messagesAPI.createMessage(newMessage);

      const messageCreated = {
        ...message,
        text: message.content,
      };

      pubsub.publish("MESSAGE_CREATED", { messageCreated });

      return messageCreated;
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
          error?.extensions.response.body.message.slice(1, 6) === "11000"
        ) {
          throw new Error(`User or email has already been taken`);
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
          maxAge: 1000 * 60 * 60 * 24,
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
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });

      return { success: true };
    },

    sendFriendRequest: async (parent, { friendId }, { user, dataSources }) => {
      try {
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
      } catch (error) {
        logger.error(error);
      }
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
      try {
        await dataSources.userAPI.unfriend(user.userId, friendId);

        const conversations =
          await dataSources.messagesAPI.getConversationsFromUser(user.userId);

        const oneOnOneConversations = conversations.filter(
          (conversation) => conversation.isOneOnOne
        );

        const conv = oneOnOneConversations.find((conversation) =>
          conversation.members.some((member) => member.userId === friendId)
        );

        await dataSources.messagesAPI.deleteConversation(conv._id);

        pubsub.publish(`FRIEND_REMOVED:${friendId}`, {
          friendRemoved: friendId,
        });

        return friendId;
      } catch (error) {
        logger.error(error);
      }
    },

    leaveConversation: async (
      parent,
      { conversationId },
      { user, dataSources }
    ) => {
      await dataSources.messagesAPI.leaveConversation({
        conversationId,
        userId: user.userId,
      });

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

      pubsub.publish(`REMOVED_FROM_CONVERSATION`, {
        removedFromConversation: participantId,
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
        async ({ messageCreated }, _, { user, dataSources }) => {
          const conversation = await dataSources.messagesAPI.getConversation(
            messageCreated.conversationId
          );

          return conversation.members.some(
            (member) => member.userId === user.userId
          );
        }
      ),
    },
    friendRequestSent: {
      subscribe: withFilter(
        (_, __, { user }) => {
          return pubsub.asyncIterator([`FRIEND_REQUEST_SENT:${user.userId}`]);
        },
        () => true
      ),
    },
    friendRequestAccepted: {
      subscribe: withFilter(
        (_, __, { user }) => {
          return pubsub.asyncIterator([
            `FRIEND_REQUEST_ACCEPTED:${user.userId}`,
          ]);
        },
        () => true
      ),
    },
    friendRemoved: {
      subscribe: withFilter(
        (_, __, { user }) => {
          return pubsub.asyncIterator([`FRIEND_REMOVED:${user.userId}`]);
        },
        () => true
      ),
    },
    addedToConversation: {
      subscribe: withFilter(
        () => {
          return pubsub.asyncIterator(["ADDED_TO_CONVERSATION"]);
        },
        ({ addedToConversation }, _, { user }) => {
          return addedToConversation.members.some(
            (member) => member.userId === user.userId
          );
        }
      ),
    },
    removedFromConversation: {
      subscribe: withFilter(
        () => {
          return pubsub.asyncIterator(["REMOVED_FROM_CONVERSATION"]);
        },
        ({ removedFromConversation }, _, { user }) => {
          return removedFromConversation === user.userId;
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

      const isMember = conversation.members.some(
        (member) => member.userId === user.userId
      );

      if (!isMember) throw GraphQLError("Not part of the conversation");

      return conversation;
    },
    friends: async (parent, context, { user, dataSources }) => {
      return await dataSources.userAPI.getFriends(user.userId);
    },
    messages: async (parent, { conversationId }, { user, dataSources }) => {
      const conversation = await dataSources.messagesAPI.getConversation(
        conversationId
      );

      const isMember = conversation.members.some(
        (member) => member.userId === user.userId
      );

      if (!isMember) throw GraphQLError("Not part of the conversation");

      return await dataSources.messagesAPI.getMessages(conversationId);
    },
    conversations: async (_, __, { dataSources, user }) => {
      const { userId } = user;
      const conversations =
        await dataSources.messagesAPI.getConversationsFromUser(userId);

      return conversations;
    },
    discoveredUsers: async (parent, { search }, { dataSources, user }) => {
      try {
        const data = await dataSources.userAPI.search(search);
        const me = await dataSources.userAPI.getUser(user.userId);
        const results = data
          .map((contact) => ({
            ...contact,
            requestSent: contact.friendRequests.includes(me._id),
          }))
          .filter(
            (contact) =>
              contact._id !== me._id &&
              !me.friendRequests.some((user) => user._id === contact._id)
          );

        return results;
      } catch (error) {
        logger.error(error);
      }
    },
  },
};

module.exports = resolvers;
