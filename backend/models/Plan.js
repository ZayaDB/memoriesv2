const mongoose = require("mongoose");

const planSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  date: { type: Date, required: true },
  type: { type: String, enum: ["anniversary", "trip"], required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Plan", planSchema);
