const { Schema, model } = require("mongoose");
const validator = require("validator");

const SettingsSchema = new Schema({
  language: String,
});

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    maxLength: 20,
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxLength: 20,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    maxLength: 20,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    validate: {
      validator: (email) => validator.isEmail(email),
    },
    maxLength: 40,
  },
  avatar: String,
  friends: [String],
  friendRequests: [{ type: Schema.Types.ObjectId, ref: "User" }],
  conversations: [String],
  settings: SettingsSchema,
});

const User = model("User", UserSchema);
module.exports = User;
