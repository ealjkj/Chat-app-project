const { RESTDataSource } = require("@apollo/datasource-rest");

class MessagesAPI extends RESTDataSource {
  baseURL = process.env.MESSAGES_API;

  // ---------- Conversations ------------
  async createConversation(body) {
    return this.post(`/conversation/create`, {
      body,
    });
  }

  async getConversation(id) {
    return this.get(`/conversation/${id}`);
  }

  async getConversationsFromUser(userId) {
    return this.get(`/conversation/ofUser/${userId}`);
  }

  async removeParticipant({ conversationId, participantId }) {
    return this.put(`/conversation/removeUser/${conversationId}`, {
      body: { userId: participantId },
    });
  }
  async addParticipants({ conversationId, participants }) {
    return this.put(`/conversation/addUsers/${conversationId}`, {
      body: { usersIds: participants },
    });
  }
  // ---------- Messages ------------
  async createMessage(message) {
    return this.post(`/message/create`, {
      body: message,
    });
  }
}

module.exports = MessagesAPI;
