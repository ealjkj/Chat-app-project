const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/users-db", {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("auth-db connected");
  });
