const { RESTDataSource } = require("@apollo/datasource-rest");

class AuthAPI extends RESTDataSource {
  baseURL = process.env.AUTH_API;

  async login(user) {
    return this.post(`/login`, { body: user });
  }

  async signup(newUser) {
    return this.post("/signup", { body: newUser });
  }

  async profile(token) {
    return this.get("/profile", { params: { token } });
  }
}

module.exports = AuthAPI;
