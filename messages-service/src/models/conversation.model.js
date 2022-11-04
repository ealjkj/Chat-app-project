const { Schema, model } = require("mongoose");
const Message = require("./message.model");

const MemberSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },

  joinedAt: {
    type: Date,
    default: () => Date.now(),
  },
});

const ConversationSchema = new Schema({
  title: {
    type: String,
    trim: true,
  },
  isOneOnOne: {
    type: Boolean,
    default: true,
  },
  message: String,
  members: [MemberSchema],
});

ConversationSchema.pre("save", function (next) {
  if (this.isOneOnOne && this.title) {
    throw new Error("One on One conversations cannot have title");
  }
  next();
});

ConversationSchema.pre("remove", function (next) {
  Message.deleteOne({ conversationId: this._id }).exec();
  next();
});

const Conversation = model("Conversation", ConversationSchema);

module.exports = Conversation;
