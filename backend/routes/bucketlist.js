const express = require("express");
const router = express.Router();
const BucketList = require("../models/BucketList");

// 전체 목록 조회
router.get("/", async (req, res) => {
  const items = await BucketList.find().sort({ createdAt: -1 });
  res.json(items);
});

// 새 항목 추가
router.post("/", async (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ error: "제목 필요" });
  const item = await BucketList.create({ title });
  res.json(item);
});

// 항목 완료/후기/사진 수정
router.patch("/:id", async (req, res) => {
  const { done, review, photos } = req.body;
  const update = {};
  if (done !== undefined) {
    update.done = done;
    update.completedAt = done ? new Date() : null;
  }
  if (review !== undefined) update.review = review;
  if (photos !== undefined) update.photos = photos;
  const item = await BucketList.findByIdAndUpdate(req.params.id, update, {
    new: true,
  });
  res.json(item);
});

// 항목 삭제
router.delete("/:id", async (req, res) => {
  await BucketList.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

module.exports = router;
