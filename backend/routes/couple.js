const express = require("express");
const Couple = require("../models/Couple");
const User = require("../models/User");
const router = express.Router();

// TODO: 인증 미들웨어 추가 (예: requireAuth)

// 초대코드 생성 함수
function generateInviteCode(length = 6) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// 1. 커플방 생성 (초대코드 자동 생성, 본인 멤버로 추가)
router.post("/create", async (req, res) => {
  try {
    const { userId, name } = req.body; // userId는 프론트에서 전달 또는 인증 미들웨어로 대체
    let inviteCode;
    let exists = true;
    // 중복 없는 초대코드 생성
    while (exists) {
      inviteCode = generateInviteCode();
      exists = await Couple.findOne({ inviteCode });
    }
    const couple = new Couple({ inviteCode, members: [userId], name });
    await couple.save();
    // 유저 coupleId 업데이트
    await User.findByIdAndUpdate(userId, { coupleId: couple._id });
    res.json({ coupleId: couple._id, inviteCode });
  } catch (err) {
    res.status(500).json({ message: "커플방 생성 실패", error: err.message });
  }
});

// 2. 초대코드로 커플방 입장
router.post("/join", async (req, res) => {
  try {
    const { userId, inviteCode } = req.body;
    const couple = await Couple.findOne({ inviteCode });
    if (!couple)
      return res.status(404).json({ message: "초대코드가 올바르지 않습니다." });
    // 이미 멤버인지 확인
    if (couple.members.includes(userId)) {
      return res.status(400).json({ message: "이미 커플방에 참여 중입니다." });
    }
    couple.members.push(userId);
    await couple.save();
    await User.findByIdAndUpdate(userId, { coupleId: couple._id });
    res.json({ coupleId: couple._id, inviteCode });
  } catch (err) {
    res.status(500).json({ message: "커플방 입장 실패", error: err.message });
  }
});

// 3. 내 커플방 정보 조회
router.get("/me/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user || !user.coupleId) return res.json({ couple: null });
    const couple = await Couple.findById(user.coupleId);
    res.json({ couple });
  } catch (err) {
    res
      .status(500)
      .json({ message: "커플방 정보 조회 실패", error: err.message });
  }
});

// 4. 커플 정보 수정 (이름, 사귄 날짜, 기념일 등)
router.patch("/:id", async (req, res) => {
  try {
    const { name, startDate, anniversary } = req.body;
    const couple = await Couple.findByIdAndUpdate(
      req.params.id,
      { $set: { name, startDate, anniversary } },
      { new: true }
    );
    res.json({ couple });
  } catch (err) {
    res
      .status(500)
      .json({ message: "커플 정보 수정 실패", error: err.message });
  }
});

module.exports = router;
