const express = require("express");
const User = require("../models/user.model");
const logger = require("../logger");
const mongoose = require("mongoose");

const router = express.Router();

router.get("/fromArray/:ids", async (req, res) => {
  const { ids } = req.params;
  const objectIds = ids.split(",").map((str) => mongoose.Types.ObjectId(str));

  try {
    const users = await User.find({ _id: { $in: objectIds } });
    if (!users) {
      return res.status(404).send({ message: "User not Found" });
    }
    logger.info(`*********users: ${users} `);
    return res.send(users);
  } catch (error) {
    logger.error(error);
    return res.status(500).send({ message: "Server Error" });
  }
});

router.get("/exists", async (req, res) => {
  try {
    const user = await User.findOne(req.query);
    if (!user) {
      return res.send({ existence: false });
    }
    res.send({ existence: true });
  } catch (error) {
    logger.error(error);
    return res.status(500).send({ message: "Server Error" });
  }
});

router.put("/editSettings/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send({ message: "User not Found" });
    }

    if (user.settings) {
      user.settings = { ...user.settings.toObject(), ...req.body };
    } else {
      user.settings = req.body;
    }

    await user.save();

    res.send(user);
  } catch (error) {
    logger.error(error);
    return res.status(500).send(error);
  }
});

router.get("/fromSearch", async (req, res) => {
  const { search } = req.query;
  const specialCharacters = [
    ".",
    "+",
    "*",
    "?",
    "^",
    "$",
    "(",
    ")",
    "[",
    "]",
    "{",
    "}",
    "|",
    "\\",
  ];

  try {
    const fixedRegex = Array.from(search)
      .map((c) => (specialCharacters.includes(c) ? `\\${c}` : c))
      .join("");
    const regexp = new RegExp(`^${fixedRegex}`);
    const users = await User.find({ email: regexp });
    if (!users) {
      return res.status(404).send({ message: "User not Found" });
    }
    res.send(users);
  } catch (error) {
    logger.error(error);
    return res.status(500).send({ message: "Server Error" });
  }
});

router.post("/create", async (req, res) => {
  try {
    await User.init();
    const user = await User.create({
      ...req.body,
      friends: [],
      conversations: [],
    });
    res.send(user);
  } catch (error) {
    logger.error(error);
    return res.status(500).send({ message: error.message });
  }
});

router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).send({ message: "User not Found" });
    }

    user.remove();
    res.send(user);
  } catch (error) {
    logger.error(error);
    return res.status(500).send({ message: "Server Error" });
  }
});

router.put("/update/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).send({ message: "User not Found" });
    }

    for (let prop in req.body) {
      user[prop] = req.body[prop];
    }

    user.save();
    res.send(user);
  } catch (error) {
    logger.error(error);
    return res.send({ message: "Server Error" });
  }
});

router.post("/friendRequest", async (req, res) => {
  const { sourceId, targetId } = req.body;
  if (sourceId === targetId) {
    res.status(400).send("User cannot add itself");
  }

  try {
    const source = await User.findById(sourceId);
    if (!source) {
      return res.status(404).send({ message: "User not found" });
    }

    const target = await User.findById(targetId);
    if (!target) {
      return res
        .status(404)
        .send({ message: "The user you want to add does not exist" });
    }

    if (target.friendRequests.includes(sourceId)) {
      return res.status(400).send({ message: "Friend request already sent" });
    }

    if (target.friends.includes(sourceId)) {
      return res.status(400).send({ message: "Already Friends" });
    }

    await User.findOneAndUpdate(
      { _id: targetId },
      { $push: { friendRequests: sourceId } }
    );

    return res.send();
  } catch (error) {
    logger.error(error);
    return res.send({ message: "Server Error" });
  }
});

router.post("/friend", async (req, res) => {
  const { sourceId, targetId } = req.body;
  try {
    const source = await User.findById(sourceId);
    if (!source) {
      return res.status(404).send({ message: "User 1 not Found" });
    }

    const target = await User.findById(targetId);
    if (!target) {
      return res.status(404).send({ message: "User 2 not Found" });
    }

    if (target.friends.includes(sourceId)) {
      return res.status(200).send({ message: "Already Friends" });
    }

    source.friends.push(targetId);
    target.friends.push(sourceId);

    await source.save();
    await target.save();
    await User.findOneAndUpdate(
      { _id: targetId },
      { $pull: { friendRequests: sourceId } }
    );

    return res.send({ id1: source.friends, id2: target.friends });
  } catch (error) {
    logger.error(error);
    return res.status(500).send({ message: "Server Error" });
  }
});

router.delete("/friendRequest", async (req, res) => {
  const { sourceId, targetId } = req.body;
  try {
    const source = await User.findById(sourceId);
    if (!source) {
      return res.status(404).send({ message: "User 1 not Found" });
    }

    const target = await User.findById(targetId);
    if (!target) {
      return res.status(404).send({ message: "User 2 not Found" });
    }
    await User.findOneAndUpdate(
      { _id: targetId },
      { $pull: { friendRequests: sourceId } }
    );

    return res.send({
      [sourceId]: source.friendRequests,
      [targetId]: target.friendRequests,
    });
  } catch (error) {
    logger.error(error);
    return res.status(500).send({ message: "Server Error" });
  }
});

router.delete("/friend", async (req, res) => {
  const { id1, id2 } = req.body;
  try {
    const user1 = await User.findOneAndUpdate(
      { _id: id1 },
      { $pull: { friends: id2 } }
    );
    const user2 = await User.findOneAndUpdate(
      { _id: id2 },
      { $pull: { friends: id1 } }
    );
    res.send({ id1: user1.friends, id2: user2.friends });
  } catch (error) {
    logger.error(error);
    return res.status(500).send({ message: "Server Error" });
  }
});

router.get("/friends/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const friends = await User.find({
      friends: { $elemMatch: { $eq: userId } },
    });

    res.send(friends);
  } catch (error) {
    logger.error(error);
    return res.status(500).send({ message: "Server Error" });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id).populate("friendRequests").exec();
    if (!user) {
      return res.status(404).send({ message: "User not Found" });
    }
    res.send(user);
  } catch (error) {
    logger.error(error);
    return res.status(500).send(error);
  }
});

router.get("/", async (req, res) => {
  const { username } = req.query;
  try {
    const user = await User.findOne({ username })
      .populate("friendRequests")
      .exec();

    if (!user) {
      return res.status(404).send({ message: "User not Found" });
    }
    res.send(user);
  } catch (error) {
    logger.error(error);
    return res.status(500).send(error);
  }
});

module.exports = router;
