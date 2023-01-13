const { RESTDataSource } = require("@apollo/datasource-rest");

class UserAPI extends RESTDataSource {
  baseURL = process.env.USER_API;

  async getUserByUsername(username) {
    return this.get(`/user/?username=${encodeURIComponent(username)}`);
  }

  async getUser(userId) {
    return this.get(`/user/${userId}`);
  }

  async getUsers(idList) {
    return this.get(`/user/fromArray/${encodeURIComponent(idList)}`);
  }

  async createUser(user) {
    return this.post(`/user/create`, { body: user });
  }

  async sendFriendRequest({ sourceId, targetId }) {
    return this.post(`/user/friendRequest`, {
      body: {
        sourceId,
        targetId,
      },
    });
  }

  async editSettings(userId, settings) {
    return this.put(`/user/editSettings/${encodeURIComponent(userId)}`, {
      body: settings,
    });
  }

  async acceptFriend({ sourceId, targetId }) {
    return this.post("/user/friend", {
      body: { sourceId, targetId },
    });
  }

  async rejectFriend({ sourceId, targetId }) {
    return this.delete("/user/friendRequest", {
      body: { sourceId, targetId },
    });
  }

  async unfriend(userId, friendId) {
    return this.delete(`/user/friend`, {
      body: {
        id1: userId,
        id2: friendId,
      },
    });
  }

  async exists(params) {
    return this.get(`/user/exists`, { params });
  }
}

module.exports = UserAPI;
