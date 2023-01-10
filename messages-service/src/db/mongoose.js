const mongoose = require("mongoose");
const logger = require("../logger");
mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
  })
  .then(() => {
    logger.info("conversation-db connected");
  });
