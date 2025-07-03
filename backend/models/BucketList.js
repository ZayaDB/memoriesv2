const mongoose = require("mongoose");

const bucketListSchema = new mongoose.Schema({
  title: { type: String, required: true },
  done: { type: Boolean, default: false },
  completedAt: { type: Date },
  photos: [{ type: String }], // Cloudinary URL 등
  review: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("BucketList", bucketListSchema);
