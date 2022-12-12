const express = require("express");
const Message = require("../models/message.model");
const Conversation = require("../models/conversation.model");
const router = express.Router();

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const message = await Message.findById(id);
    if (!message) {
      return res.status(404).send({ message: "Conversation not Found" });
    }
    res.send(message);
  } catch (error) {
    return res.status(500).send({ message: "Server Error" });
  }
});

router.get("/ofConversation/:conversationId", async (req, res) => {
  const { conversationId } = req.params;
  try {
    const message = await Message.find({ conversationId });
    if (!message) {
      return res.status(404).send({ message: "Conversation not Found" });
    }
    res.send(message);
  } catch (error) {
    return res.status(500).send({ message: "Server Error" });
  }
});

router.post("/create", async (req, res) => {
  try {
    console.log(req.body);
    const conversation = await Conversation.findById(req.body.conversationId);

    if (!conversation) {
      return res.status(404).send({ message: "Conversation does not exist" });
    }

    if (
      !conversation.members.find((member) => member.userId === req.body.from)
    ) {
      return res
        .status(400)
        .send({ message: "User is not part of the conversation" });
    }

    const message = await Message.create(req.body);
    conversation.lastMessage = message._id;
    await conversation.save();
    res.send(message);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const message = await Message.findById(id);

    if (!message) {
      return res.status(404).send({ message: "Conversation not Found" });
    }

    message.remove();
    res.send(message);
  } catch (error) {
    res.status(500).send({ message: "Server Error" });
  }
});

module.exports = router;
