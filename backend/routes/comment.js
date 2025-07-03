const express = require("express");
const Comment = require("../models/Comment");
const router = express.Router();

// 댓글 작성
router.post("/", async (req, res) => {
  try {
    const { postId, content, author } = req.body;
    if (!postId || !content)
      return res.status(400).json({ message: "postId와 내용이 필요해요!" });
    const comment = new Comment({
      postId,
      content,
      author: author || "ZAYA & ENKHJIN",
    });
    await comment.save();
    res.json(comment);
  } catch (err) {
    res.status(500).json({ message: "댓글 작성 실패", error: err });
  }
});

// 댓글 목록 (특정 글)
router.get("/", async (req, res) => {
  const { postId } = req.query;
  if (!postId) return res.status(400).json({ message: "postId가 필요해요!" });
  const comments = await Comment.find({ postId }).sort({ createdAt: -1 });
  res.json(comments);
});

module.exports = router;
