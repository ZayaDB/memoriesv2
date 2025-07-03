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

// 사진 업로드
router.post("/", upload.single("photo"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "파일이 필요해요!" });
    // cloudinary 업로드
    const result = await cloudinary.uploader.upload_stream(
      {
        folder: "couple-memory",
        resource_type: "image",
      },
      async (error, result) => {
        if (error)
          return res
            .status(500)
            .json({ message: "Cloudinary 업로드 실패", error });
        // DB 저장
        const photo = new Photo({
          url: result.secure_url,
          uploader: req.body.uploader || "ENKHJIN & ZAYA",
          caption: req.body.caption,
        });
        await photo.save();
        res.json(photo);
      }
    );
    result.end(req.file.buffer);
  } catch (err) {
    res.status(500).json({ message: "업로드 실패", error: err });
  }
});

// 사진 목록 (최신순)
router.get("/", async (req, res) => {
  const photos = await Photo.find().sort({ createdAt: -1 });
  res.json(photos);
});

module.exports = router;
