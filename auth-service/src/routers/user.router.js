const express = require("express");
const passport = require("passport");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

require("../middleware/passport.middleware");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "mysecret";

router.post(
  "/signup",
  passport.authenticate("signup", { session: false }),
  (req, res) => {
    res.send(req.user.username);
  }
);

router.post("/login", async (req, res, next) => {
  const authFunc = passport.authenticate("login", async (err, user, info) => {
    try {
      if (err || !user) {
        const error = new Error("Something went wrong");
        return next(error);
      }

      req.login(user, { session: false }, async (error) => {
        if (error) return next(error);
        const body = { _id: user._id, username: user.username };
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
