const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/auth-db", {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("auth-db connected");
  });
