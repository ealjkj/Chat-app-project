const express = require("express");
require("dotenv").config();
require("./db/mongoose");

// Routes
const userRouter = require("./routers/user.router");

const app = express();
const expressWinston = require("express-winston");

const logger = require("./logger");
app.use(
  expressWinston.logger({
    winstonInstance: logger,
    statusLevels: true,
  })
);

const PORT = process.env.PORT;

app.use(express.json());
app.use(userRouter);

// Error handeling
app.use((err, req, res, next) => {
  return res.status(500).send({ error: err.message, code: err.code });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
