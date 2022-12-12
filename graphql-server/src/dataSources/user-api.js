const { RESTDataSource } = require("@apollo/datasource-rest");

class UserAPI extends RESTDataSource {
  baseURL = process.env.USER_API;

  async getUserByUsername(username) {
    return this.get(`/user/?username=${encodeURIComponent(username)}`);
  }

  async getUsers(idList) {
    return this.get(`/user/fromArray/${encodeURIComponent(idList)}`);
  }

  async createUser(user) {
    return this.post(`/user/create`, { body: user });
  }

  async editSettings(userId, settings) {
    return this.put(`/user/editSettings/${encodeURIComponent(userId)}`, {
      body: settings,
    });
  }

  async unfriend(userId, friendId) {
    return this.post(`/user/unfriend`, {
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
