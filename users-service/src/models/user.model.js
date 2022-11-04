const { Schema, model } = require("mongoose");
const validator = require("validator");

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: (email) => validator.isEmail(email),
    },
  },
  avatar: String,
  friends: [String],
  conversations: [String],
});

const User = model("User", UserSchema);
module.exports = User;
