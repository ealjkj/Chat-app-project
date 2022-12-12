const mongoose = require("mongoose");
const MONGODB_URL = process.env.MONGODB_URL;

mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("conversation-db connected");
  });
