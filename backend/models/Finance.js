const mongoose = require("mongoose");

const incomeSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  category: { type: String, required: true }, // 급여, 부업, 투자 등
  date: { type: Date, default: Date.now },
  description: { type: String, default: "" },
});

const fixedExpenseSchema = new mongoose.Schema({
  name: { type: String, required: true }, // 월세, 관리비, 통신비 등
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  description: { type: String, default: "" },
});

const savingsSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  description: { type: String, default: "" },
});

const financeSchema = new mongoose.Schema({
  coupleId: {
    type: String,
    required: true,
  },
  // 목표 설정
  goal: {
    targetAmount: { type: Number, default: 0 }, // 목표 금액
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date, default: Date.now },
    monthlyTarget: { type: Number, default: 0 }, // 월 목표 (자동 계산)
  },
  // 수익 관리
  monthlyIncome: { type: Number, default: 0 },
  incomes: [incomeSchema],
  // 고정 지출 관리
  monthlyFixedExpense: { type: Number, default: 0 },
  fixedExpenses: [fixedExpenseSchema],
  // 적금 관리
  monthlySavings: { type: Number, default: 0 },
  totalSavings: { type: Number, default: 0 },
  savings: [savingsSchema],
  // 계산된 값들
  availableForSavings: { type: Number, default: 0 }, // 적금 가능 금액
  goalProgress: { type: Number, default: 0 }, // 목표 달성률 (%)
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// 업데이트 시 updatedAt 자동 갱신
financeSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

// 월 목표 자동 계산
financeSchema.methods.calculateMonthlyTarget = function () {
  if (this.goal.targetAmount && this.goal.startDate && this.goal.endDate) {
    const startDate = new Date(this.goal.startDate);
    const endDate = new Date(this.goal.endDate);
    const monthsDiff =
      (endDate.getFullYear() - startDate.getFullYear()) * 12 +
      (endDate.getMonth() - startDate.getMonth());
    this.goal.monthlyTarget = Math.ceil(
      this.goal.targetAmount / Math.max(monthsDiff, 1)
    );
  }
};

// 적금 가능 금액 계산
financeSchema.methods.calculateAvailableSavings = function () {
  this.availableForSavings = this.monthlyIncome - this.monthlyFixedExpense;
};

// 목표 달성률 계산
financeSchema.methods.calculateGoalProgress = function () {
  if (this.goal.targetAmount > 0) {
    this.goalProgress = Math.round(
      (this.totalSavings / this.goal.targetAmount) * 100
    );
  }
};

module.exports = mongoose.model("Finance", financeSchema);
