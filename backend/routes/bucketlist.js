const express = require("express");
const router = express.Router();
const BucketList = require("../models/BucketList");

// 전체 목록 조회
router.get("/", async (req, res) => {
  const { coupleId } = req.query;
  if (!coupleId) return res.json([]);
  const items = await BucketList.find({ coupleId }).sort({ createdAt: -1 });
  res.json(items);
});

// 새 항목 추가
router.post("/", async (req, res) => {
  const { title, coupleId } = req.body;
  if (!title || !coupleId)
    return res.status(400).json({ error: "제목, 커플ID 필요" });
  const item = await BucketList.create({ title, coupleId });
  res.json(item);
});

// 항목 완료/후기/사진 수정
router.patch("/:id", async (req, res) => {
  const { done, review } = req.body;
  const update = {};
  if (done !== undefined) {
    update.done = done;
    update.completedAt = done ? new Date() : null;
  }
  if (review !== undefined) update.review = review;
  const item = await BucketList.findByIdAndUpdate(req.params.id, update, {
    new: true,
  });
  if (!item)
    return res.status(404).json({ message: "항목을 찾을 수 없습니다." });
  res.json(item);
});

// 항목 삭제
router.delete("/:id", async (req, res) => {
  await BucketList.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

module.exports = router;
