const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const Photo = require("../models/Photo");
const router = express.Router();

// multer 메모리 저장소 사용
const storage = multer.memoryStorage();
const upload = multer({ storage });

// cloudinary 설정
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 여러 사진 업로드
router.post("/", upload.array("photos"), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0)
      return res.status(400).json({ message: "파일이 필요해요!" });
    const { coupleId } = req.body;
    if (!coupleId) return res.status(400).json({ message: "커플ID 필요" });
    const urls = [];
    // 각 파일을 Cloudinary에 업로드
    for (const file of req.files) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "couple-memory",
            resource_type: "image",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(file.buffer);
      });
      urls.push(result.secure_url);
    }
    // DB 저장
    const photo = new Photo({
      urls,
      uploader: req.body.uploader || "ZAYA & ENKHJIN",
      caption: req.body.caption,
      coupleId,
    });
    await photo.save();
    res.json(photo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "업로드 실패", error: err });
  }
});

// 사진 목록 (최신순)
router.get("/", async (req, res) => {
  const { coupleId } = req.query;
  let query = {};
  if (coupleId) query.coupleId = coupleId;
  const photos = await Photo.find(query).sort({ createdAt: -1 });
  res.json(photos);
});

module.exports = router;
