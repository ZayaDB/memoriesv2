const express = require("express");
const Plan = require("../models/Plan");
const router = express.Router();

// 일정 추가
router.post("/", async (req, res) => {
  try {
    const { title, description, startDate, endDate, place, type } = req.body;
    if (!title || !startDate || !type)
      return res
        .status(400)
        .json({ message: "제목, 시작일, 타입이 필요해요!" });
    const plan = new Plan({
      title,
      description,
      startDate,
      endDate,
      place,
      type,
    });
    await plan.save();
    res.json(plan);
  } catch (err) {
    res.status(500).json({ message: "일정 추가 실패", error: err });
  }
});

// 일정 목록 (최신순)
router.get("/", async (req, res) => {
  const plans = await Plan.find().sort({ startDate: 1 });
  res.json(plans);
});

// 일정 수정/완료/후기/사진 등
router.patch("/:id", async (req, res) => {
  const {
    title,
    description,
    startDate,
    endDate,
    place,
    type,
    done,
    review,
    photos,
  } = req.body;
  const update = {};
  if (title !== undefined) update.title = title;
  if (description !== undefined) update.description = description;
  if (startDate !== undefined) update.startDate = startDate;
  if (endDate !== undefined) update.endDate = endDate;
  if (place !== undefined) update.place = place;
  if (type !== undefined) update.type = type;
  if (done !== undefined) update.done = done;
  if (review !== undefined) update.review = review;
  if (photos !== undefined) update.photos = photos;
  const plan = await Plan.findByIdAndUpdate(req.params.id, update, {
    new: true,
  });
  res.json(plan);
});

// 일정 삭제
router.delete("/:id", async (req, res) => {
  await Plan.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

module.exports = router;
