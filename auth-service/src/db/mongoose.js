const mongoose = require("mongoose");
const MONGODB_URL = process.env.MONGODB_URL;
const logger = require("../logger");
mongoose
  .connect(MONGODB_URL, {
    useNewUrlParser: true,
  })
  .then(() => {
    logger.info("auth-db connected");
  });
