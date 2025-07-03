const express = require("express");
const Post = require("../models/Post");
const router = express.Router();

// 글 작성
router.post("/", async (req, res) => {
  try {
    const { content, author, photo } = req.body;
    if (!content) return res.status(400).json({ message: "내용이 필요해요!" });
    const post = new Post({
      content,
      author: author || "ZAYA & ENKHJIN",
      photo,
    });
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: "글 작성 실패", error: err });
  }
});

// 글 목록 (최신순)
router.get("/", async (req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 });
  res.json(posts);
});

module.exports = router;
