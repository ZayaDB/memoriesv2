const express = require("express");
const Plan = require("../models/Plan");
const router = express.Router();

// 일정 추가
router.post("/", async (req, res) => {
  try {
    const { title, description, date, type } = req.body;
    if (!title || !date || !type)
      return res.status(400).json({ message: "제목, 날짜, 타입이 필요해요!" });
    const plan = new Plan({
      title,
      description,
      date,
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
  const plans = await Plan.find().sort({ date: 1 });
  res.json(plans);
});

module.exports = router;
