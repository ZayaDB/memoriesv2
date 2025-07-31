const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// 회원가입
router.post("/register", async (req, res) => {
  try {
    const { email, password, name } = req.body;
    // 이메일 중복 체크
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "이미 가입된 이메일입니다." });

    // 비밀번호 암호화
    const hashedPassword = await bcrypt.hash(password, 10);

    // 유저 생성
    const user = new User({ email, password: hashedPassword, nickname: name });
    await user.save();

    res.status(201).json({
      message: "회원가입 성공!",
      userId: user._id,
      user: {
        email: user.email,
        nickname: user.nickname,
        coupleId: user.coupleId,
        _id: user._id,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "서버 오류", error: err.message });
  }
});

// 로그인
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ message: "이메일 또는 비밀번호가 올바르지 않습니다." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ message: "이메일 또는 비밀번호가 올바르지 않습니다." });

    // JWT 토큰 발급
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      token,
      user: {
        email: user.email,
        nickname: user.nickname,
        coupleId: user.coupleId,
        _id: user._id,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "서버 오류", error: err.message });
  }
});

module.exports = router;
