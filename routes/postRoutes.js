const express = require("express");
const Post = require("../models/Post");
const Reply = require("../models/Reply");
const router = express.Router();

router.post("/", async (req, res) => {
  const { title, content, author } = req.body;
  try {
    const post = await Post.create({ title, content, author });
    res.json(post);
  } catch (err) {
    console.error("❌ Post creation error:", err);
    res.status(500).json({ msg: "Failed to create post", error: err.message });
  }
});


router.get("/", async (req, res) => {
  const sortBy = req.query.sortBy || "createdAt";
  const order = sortBy === "votes" ? [["votes", "DESC"]] : [["createdAt", "DESC"]];
  const posts = await Post.findAll({ order });
  res.json(posts);
});


router.get("/:id", async (req, res) => {
  const post = await Post.findByPk(req.params.id, { include: Reply });
  res.json(post);
});


router.post("/:id/reply", async (req, res) => {
  const { content, author } = req.body;
  const reply = await Reply.create({ content, author, PostId: req.params.id });
  res.json(reply);
});

router.post("/:id/upvote", async (req, res) => {
  const post = await Post.findByPk(req.params.id);
  post.votes++;
  await post.save();
  res.json({ votes: post.votes });
});

module.exports = router;
