const express = require("express");
const router = express.Router();
const Finance = require("../models/Finance");

// 커플의 금융 데이터 조회
router.get("/", async (req, res) => {
  const { coupleId } = req.query;
  if (!coupleId) return res.json({});

  try {
    const finance = await Finance.findOne({ coupleId });
    if (!finance) {
      // 초기 데이터 생성
      const newFinance = await Finance.create({
        coupleId,
        monthlyIncome: 0,
        weeklyIncome: 0,
        monthlyBudget: 0,
        savingsGoal: 0,
        savings: 0,
        expenses: [],
        incomes: [],
      });
      return res.json(newFinance);
    }
    res.json(finance);
  } catch (error) {
    res.status(500).json({ error: "데이터 조회 실패" });
  }
});

// 수익 추가
router.post("/income", async (req, res) => {
  const { coupleId, amount, category, date, description } = req.body;
  if (!coupleId || !amount) {
    return res.status(400).json({ error: "커플ID와 금액이 필요합니다" });
  }

  try {
    let finance = await Finance.findOne({ coupleId });
    if (!finance) {
      finance = await Finance.create({ coupleId });
    }

    const income = {
      amount: Number(amount),
      category: category || "기타",
      date: date || new Date(),
      description: description || "",
    };

    finance.incomes.push(income);
    finance.monthlyIncome = finance.incomes
      .filter((inc) => {
        const incDate = new Date(inc.date);
        const now = new Date();
        return (
          incDate.getMonth() === now.getMonth() &&
          incDate.getFullYear() === now.getFullYear()
        );
      })
      .reduce((sum, inc) => sum + inc.amount, 0);

    finance.weeklyIncome = finance.incomes
      .filter((inc) => {
        const incDate = new Date(inc.date);
        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return incDate >= weekAgo;
      })
      .reduce((sum, inc) => sum + inc.amount, 0);

    await finance.save();
    res.json(finance);
  } catch (error) {
    res.status(500).json({ error: "수익 추가 실패" });
  }
});

// 지출 추가
router.post("/expense", async (req, res) => {
  const { coupleId, amount, category, date, description } = req.body;
  if (!coupleId || !amount) {
    return res.status(400).json({ error: "커플ID와 금액이 필요합니다" });
  }

  try {
    let finance = await Finance.findOne({ coupleId });
    if (!finance) {
      finance = await Finance.create({ coupleId });
    }

    const expense = {
      amount: Number(amount),
      category: category || "기타",
      date: date || new Date(),
      description: description || "",
    };

    finance.expenses.push(expense);
    finance.monthlyExpense = finance.expenses
      .filter((exp) => {
        const expDate = new Date(exp.date);
        const now = new Date();
        return (
          expDate.getMonth() === now.getMonth() &&
          expDate.getFullYear() === now.getFullYear()
        );
      })
      .reduce((sum, exp) => sum + exp.amount, 0);

    await finance.save();
    res.json(finance);
  } catch (error) {
    res.status(500).json({ error: "지출 추가 실패" });
  }
});

// 목표 설정 (예산, 저축목표)
router.patch("/goals", async (req, res) => {
  const { coupleId, monthlyBudget, savingsGoal } = req.body;
  if (!coupleId) {
    return res.status(400).json({ error: "커플ID가 필요합니다" });
  }

  try {
    let finance = await Finance.findOne({ coupleId });
    if (!finance) {
      finance = await Finance.create({ coupleId });
    }

    if (monthlyBudget !== undefined)
      finance.monthlyBudget = Number(monthlyBudget);
    if (savingsGoal !== undefined) finance.savingsGoal = Number(savingsGoal);

    await finance.save();
    res.json(finance);
  } catch (error) {
    res.status(500).json({ error: "목표 설정 실패" });
  }
});

// 저축액 업데이트
router.patch("/savings", async (req, res) => {
  const { coupleId, savings } = req.body;
  if (!coupleId || savings === undefined) {
    return res.status(400).json({ error: "커플ID와 저축액이 필요합니다" });
  }

  try {
    let finance = await Finance.findOne({ coupleId });
    if (!finance) {
      finance = await Finance.create({ coupleId });
    }

    finance.savings = Number(savings);
    await finance.save();
    res.json(finance);
  } catch (error) {
    res.status(500).json({ error: "저축액 업데이트 실패" });
  }
});

// 수익/지출 삭제
router.delete("/:type/:id", async (req, res) => {
  const { coupleId } = req.query;
  const { type, id } = req.params;

  if (!coupleId) {
    return res.status(400).json({ error: "커플ID가 필요합니다" });
  }

  try {
    const finance = await Finance.findOne({ coupleId });
    if (!finance) {
      return res.status(404).json({ error: "데이터를 찾을 수 없습니다" });
    }

    if (type === "income") {
      finance.incomes = finance.incomes.filter(
        (inc) => inc._id.toString() !== id
      );
    } else if (type === "expense") {
      finance.expenses = finance.expenses.filter(
        (exp) => exp._id.toString() !== id
      );
    }

    // 재계산
    finance.monthlyIncome = finance.incomes
      .filter((inc) => {
        const incDate = new Date(inc.date);
        const now = new Date();
        return (
          incDate.getMonth() === now.getMonth() &&
          incDate.getFullYear() === now.getFullYear()
        );
      })
      .reduce((sum, inc) => sum + inc.amount, 0);

    finance.weeklyIncome = finance.incomes
      .filter((inc) => {
        const incDate = new Date(inc.date);
        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return incDate >= weekAgo;
      })
      .reduce((sum, inc) => sum + inc.amount, 0);

    finance.monthlyExpense = finance.expenses
      .filter((exp) => {
        const expDate = new Date(exp.date);
        const now = new Date();
        return (
          expDate.getMonth() === now.getMonth() &&
          expDate.getFullYear() === now.getFullYear()
        );
      })
      .reduce((sum, exp) => sum + exp.amount, 0);

    await finance.save();
    res.json(finance);
  } catch (error) {
    res.status(500).json({ error: "삭제 실패" });
  }
});

module.exports = router;
