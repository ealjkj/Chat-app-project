const express = require("express");
const Conversation = require("../models/conversation.model");
const logger = require("../logger");
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
    logger.error(error);
    return res.status(500).send({ message: "Server Error" });
  }
});

router.get("/ofUser/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const conversations = await Conversation.find({
      members: { $elemMatch: { userId } },
    }).populate("lastMessage");

    res.send(conversations);
  } catch (error) {
    logger.error(error);
    return res.status(500).send({ message: "Server Error" });
  }
});

router.post("/create", async (req, res) => {
  try {
    const conversation = await Conversation.create(req.body);
    return res.send(conversation);
  } catch (error) {
    logger.error(error);
    return res.status(500).send(error.message);
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
    logger.error(error);
    return res.status(500).send({ message: "Server Error" });
  }
});

router.put("/addUsers/:id", async (req, res) => {
  const { id } = req.params;
  const { usersIds } = req.body;

  try {
    const conversation = await Conversation.findById(id);
    if (!conversation) {
      return res.status(404).send({ message: "Conversation not Found" });
    }

    const nonRepeatedIds = usersIds.filter(
      (id) => !conversation.includesUser(id)
    );
    const newMembers = nonRepeatedIds.map((userId) => ({ userId }));

    const updatedConversation = await Conversation.findByIdAndUpdate(id, {
      $push: {
        members: {
          $each: newMembers,
        },
      },
    });

    res.send(updatedConversation);
  } catch (error) {
    logger.error(error);
    return res.send({ message: "Server Error" });
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
    logger.error(error);
    return res.send({ message: "Server Error" });
  }
});

router.put("/leaveConversation/:id", async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;
  try {
    const conversation = await Conversation.findById(id);

    if (!conversation) {
      return res.status(404).send({ message: "Conversation not Found" });
    }

    if (conversation.members.length <= 1) {
      await Conversation.findByIdAndDelete(id);
    }

    await Conversation.findOneAndUpdate(
      { _id: id },
      { $pull: { members: { userId: userId } } }
    );

    res.send(conversation);
  } catch (error) {
    logger.error(error);
    return res.send({ message: "Server Error" });
  }
});

module.exports = router;
