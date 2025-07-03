const mongoose = require("mongoose");

const photoSchema = new mongoose.Schema({
  urls: [{ type: String, required: true }],
  uploader: { type: String, default: "ZAYA & ENKHJIN" },
  caption: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Photo", photoSchema);
