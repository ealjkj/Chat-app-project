const express = require("express");
const User = require("../models/user.model");

const router = express.Router();

router.get("/fromArray/:ids", async (req, res) => {
  const { ids } = req.params;
  try {
    const users = await User.find({ $in: ids.split(",") });
    if (!users) {
      return res.status(404).send({ message: "User not Found" });
    }
    res.send(users);
  } catch (error) {
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

    user.settings = { ...user.settings.toObject(), ...req.body };
    user.settings;
    await user.save();

    res.send(user);
  } catch (error) {
    return res.status(500).send(error);
  }
});

router.get("/fromSearch", async (req, res) => {
  const { search } = req.query;
  const regexp = new RegExp(`^${search}`);
  try {
    const users = await User.find({ email: regexp });
    if (!users) {
      return res.status(404).send({ message: "User not Found" });
    }
    res.send(users);
  } catch (error) {
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
    console.error(error);
    res.status(500).send({ message: error.message });
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
    res.status(500).send({ message: "Server Error" });
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
    res.send({ message: "Server Error" });
  }
});

router.post("/requestFriendship", async (req, res) => {
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
    res.send({ message: "Server Error" });
  }
});

router.post("/acceptFriend", async (req, res) => {
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
    return res.status(500).send({ message: "Server Error" });
  }
});

router.post("/rejectFriend", async (req, res) => {
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
    return res.status(500).send({ message: "Server Error" });
  }
});

router.post("/unfriend", async (req, res) => {
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
    res.status(500).send({ message: "Server Error" });
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
    return res.status(500).send(error);
  }
});

module.exports = router;
