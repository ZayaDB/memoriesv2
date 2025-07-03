const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  content: { type: String, required: true },
  author: { type: String, default: "ZAYA & ENKHJIN" },
  photo: { type: String }, // 사진 url (선택)
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Post", postSchema);
