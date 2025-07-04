const mongoose = require("mongoose");

const coupleSchema = new mongoose.Schema(
  {
    inviteCode: { type: String, required: true, unique: true }, // 초대코드
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // 멤버 목록
    name: { type: String }, // 방 이름(선택)
    startDate: { type: Date }, // 사귄 날짜(선택)
    anniversary: { type: Date }, // 기념일(선택)
  },
  { timestamps: true }
);

module.exports = mongoose.model("Couple", coupleSchema);
