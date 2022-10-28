const express = require("express");
const User = require("../models/user.model");

const router = express.Router();

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).send({ message: "User not Found" });
    }
    res.send(user);
  } catch (error) {
    return res.status(500).send({ message: "Server Error" });
  }
});

router.get("/", async (req, res) => {
  const { username } = req.query;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).send({ message: "User not Found" });
    }
    res.send(user);
  } catch (error) {
    return res.status(500).send({ message: "Server Error" });
  }
});

router.post("/create", async (req, res) => {
  try {
    const user = await User.create({
      ...req.body,
      friends: [],
      conversations: [],
    });
    res.send(user);
  } catch (error) {
    res.status(500).send(error.message);
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

router.post("/connect", async (req, res) => {
  const { id1, id2 } = req.body;
  try {
    const user1 = await User.findById(id1);
    if (!user1) {
      return res.status(404).send({ message: "User 1 not Found" });
    }

    const user2 = await User.findById(id2);
    if (!user2) {
      return res.status(404).send({ message: "User 2 not Found" });
    }

    if (user2.friends.includes(id1))
      return res.send({ message: "Already Friends" });

    user1.friends.push(id2);
    user2.friends.push(id1);

    user1.save();
    user2.save();

    res.send({ id1: user1.friends, id2: user2.friends });
  } catch (error) {
    res.status(500).send({ message: "Server Error" });
  }
});

router.post("/unfriend", async (req, res) => {
  const { id1, id2 } = req.body;
  try {
    const user1 = await User.findById(id1);
    if (!user1) {
      return res.status(404).send({ message: "User 1 not Found" });
    }

    const user2 = await User.findById(id2);
    if (!user2) {
      return res.status(404).send({ message: "User 2 not Found" });
    }

    const index1 = user1.friends.indexOf(id2);
    const index2 = user2.friends.indexOf(id1);

    if (index1 === -1 || index2 === -1) {
      return res.send({ message: "Already Friends" });
    }

    user1.friends.splice(index1, 1);
    user2.friends.splice(index2, 2);

    user1.save();
    user2.save();

    res.send({ id1: user1.friends, id2: user2.friends });
  } catch (error) {
    res.status(500).send({ message: "Server Error" });
  }
});

module.exports = router;
