const mongoose = require("mongoose");

const planSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  place: { type: String },
  type: {
    type: String,
    enum: ["anniversary", "trip", "date", "etc"],
    required: true,
  },
  photos: [{ type: String }],
  done: { type: Boolean, default: false },
  review: { type: String },
  coupleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Couple",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Plan", planSchema);
