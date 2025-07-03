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

// CORS 허용 (Netlify 프론트엔드 도메인과 로컬 개발 모두 허용)
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://comeries.netlify.app",
      // 실제 Netlify 배포 주소로 교체
    ],
    credentials: true,
  })
);
app.use(express.json());

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
