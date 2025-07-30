const mongoose = require("mongoose");

const incomeSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  category: { type: String, default: "기타" },
  date: { type: Date, default: Date.now },
  description: { type: String, default: "" },
});

const expenseSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  category: { type: String, default: "기타" },
  date: { type: Date, default: Date.now },
  description: { type: String, default: "" },
});

const financeSchema = new mongoose.Schema({
  coupleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Couple",
    required: true,
  },
  monthlyIncome: { type: Number, default: 0 },
  weeklyIncome: { type: Number, default: 0 },
  monthlyExpense: { type: Number, default: 0 },
  monthlyBudget: { type: Number, default: 0 },
  savings: { type: Number, default: 0 },
  savingsGoal: { type: Number, default: 0 },
  incomes: [incomeSchema],
  expenses: [expenseSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// 업데이트 시 updatedAt 자동 갱신
financeSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model("Finance", financeSchema);
