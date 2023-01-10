const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");

require("../middleware/passport.middleware");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "mysecret";

router.post(
  "/signup",
  passport.authenticate("signup", { session: false }),
  async (req, res) => {
    req.user.userId = req.body.userId;
    await req.user.save();
    res.send(req.user.username);
  }
);

router.post("/login", async (req, res, next) => {
  const authFunc = passport.authenticate("login", async (err, user, info) => {
    try {
      if (!user) {
        const error = new Error("INVALID_CREDENTIALS");
        return next(error);
      }

      if (err) {
        return next(err);
      }

      req.login(user, { session: false }, async (error) => {
        if (error) return next(error);
        const body = {
          _id: user._id,
          username: user.username,
          userId: user.userId,
        };
        const token = jwt.sign({ user: body }, JWT_SECRET);
        return res.send({ token });
      });
    } catch (error) {
      return next(error);
    }
  });

  authFunc(req, res, next);
});

router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.send({
      message: "Authenticated",
      user: req.user,
      token: req.query.secret_token,
    });
  }
);

module.exports = router;
