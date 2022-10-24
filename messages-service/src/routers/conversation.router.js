const express = require("express");
const Conversation = require("../models/conversation.model");

const router = express.Router();

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const conversation = await Conversation.findById(id);
    if (!conversation) {
      return res.status(404).send({ message: "Conversation not Found" });
    }
    res.send(conversation);
  } catch (error) {
    return res.status(500).send({ message: "Server Error" });
  }
});

router.get("/ofUser/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const conversations = await Conversation.find({
      members: { $elemMatch: { userId } },
    });

    res.send(conversations);
  } catch (error) {
    return res.status(500).send({ message: "Server Error" });
  }
});

router.post("/create", async (req, res) => {
  try {
    const conversation = await Conversation.create(req.body);
    res.send(conversation);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const conversation = await Conversation.findById(id);

    if (!conversation) {
      return res.status(404).send({ message: "Conversation not Found" });
    }

    conversation.remove();
    res.send(conversation);
  } catch (error) {
    res.status(500).send({ message: "Server Error" });
  }
});

router.put("/addUser/:id", async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;
  try {
    const conversation = await Conversation.findById(id);

    if (!conversation) {
      return res.status(404).send({ message: "Conversation not Found" });
    }

    const member = { userId };
    conversation.members.push(member);
    conversation.save();
    res.send(conversation);
  } catch (error) {
    res.send({ message: "Server Error" });
  }
});

router.put("/removeUser/:id", async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;
  try {
    const conversation = await Conversation.findById(id);

    if (!conversation) {
      return res.status(404).send({ message: "Conversation not Found" });
    }

    conversation.members = conversation.members.filter(
      (member) => member.userId != userId
    );

    conversation.save();
    res.send(conversation);
  } catch (error) {
    res.send({ message: "Server Error" });
  }
});

module.exports = router;
