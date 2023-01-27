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
    maxLength: 40,
  },
  isOneOnOne: {
    type: Boolean,
    default: true,
  },
  lastMessage: { type: Schema.Types.ObjectId, ref: "Message" },
  members: [MemberSchema],
  admins: [String],
});

ConversationSchema.pre("save", function (next) {
  if (this.isOneOnOne && this.title) {
    throw new Error("One on One conversations cannot have title");
  }
  next();
});

ConversationSchema.pre("remove", function (next) {
  Message.deleteMany({ conversationId: this._id }).exec();
  next();
});

ConversationSchema.methods.includesUser = function (id) {
  const conversation = this;
  const member = conversation.members.find(({ userId }) => userId === id);
  return Boolean(member);
};
const Conversation = model("Conversation", ConversationSchema);

module.exports = Conversation;
