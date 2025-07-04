const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    nickname: { type: String, required: true },
    coupleId: { type: String, default: null }, // 커플/그룹 방 ID
    // 추후: createdAt 등 추가 가능
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
