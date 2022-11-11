const express = require("express");
console.log(process.env);
require("dotenv").config();
console.log(process.env);
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

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
