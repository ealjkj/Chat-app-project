const { Schema, model } = require("mongoose");

const MessageSchema = new Schema({
  content: {
    type: String,
    required: true,
    maxLength: 200,
  },
  createdAt: {
    type: Date,
    default: () => Date.now(),
  },
  from: {
    type: String,
    required: true,
  },
  conversationId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Conversation",
  },
  type: {
    type: String,
    default: "text",
  },
});

const Message = model("Message", MessageSchema);

module.exports = Message;
