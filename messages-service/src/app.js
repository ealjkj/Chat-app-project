const express = require("express");
require("dotenv").config();
const expressWinston = require("express-winston");
require("./db/mongoose");

// Routes
const messagesRouter = require("./routers/message.router");
const conversationsRouter = require("./routers/conversation.router");

const app = express();

const logger = require("./logger");
app.use(
  expressWinston.logger({
    winstonInstance: logger,
    statusLevels: true,
  })
);

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use("/message", messagesRouter);
app.use("/conversation", conversationsRouter);

app.listen(PORT, () => {
  logger.info(`App listening on port ${PORT}`);
});
