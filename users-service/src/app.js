const express = require("express");
require("./db/mongoose");

// Routes
const userRouter = require("./routers/user.router");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use("/user", userRouter);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
