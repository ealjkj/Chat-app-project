const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/conversation-db", {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("conversation-db connected");
  });
