const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const photoRouter = require("./routes/photo");
const postRouter = require("./routes/post");
const commentRouter = require("./routes/comment");
const planRouter = require("./routes/plan");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// CORS 허용 (Netlify 프론트엔드 도메인으로 제한 가능)
app.use(cors());
app.use(express.json());

// 커플 비밀번호 인증 미들웨어
app.use((req, res, next) => {
  const secret = req.headers["x-couple-secret"];
  if (!secret || secret !== process.env.COUPLE_SECRET) {
    return res
      .status(401)
      .json({ message: "Unauthorized: 커플 비밀번호가 필요해요!" });
  }
  next();
});

// MongoDB 연결
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// 헬스 체크
app.get("/api/health", (req, res) => {
  res.json({ ok: true, message: "ENKHJIN & ZAYA API is running!" });
});

app.use("/api/photos", photoRouter);
app.use("/api/posts", postRouter);
app.use("/api/comments", commentRouter);
app.use("/api/plans", planRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
