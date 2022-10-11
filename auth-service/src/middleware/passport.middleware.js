const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user.model");

const JWTStrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;

const JWT_SECRET = process.env.JWT_SECRET || "mysecret";

passport.use(
  "signup",
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = User.create({ username, password });
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);

passport.use(
  "login",
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username });
      if (!user) {
        return done(null, false, { message: "Invalid user or password" });
      }
      const isValid = await user.isValidPassword(password);

      if (!isValid) {
        console.log("not valid password in middleware");
        return done(null, false);
      }

      console.log("middleware finished grasefully");
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);

passport.use(
  new JWTStrategy(
    {
      secretOrKey: JWT_SECRET,
      jwtFromRequest: ExtractJWT.fromUrlQueryParameter("secret_token"),
    },
    async (token, done) => {
      try {
        return done(null, token.user);
      } catch (error) {
        done(error);
      }
    }
  )
);
