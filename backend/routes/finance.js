const express = require("express");
const router = express.Router();
const Finance = require("../models/Finance");

// 커플의 금융 데이터 조회
router.get("/", async (req, res) => {
  const { coupleId } = req.query;
  if (!coupleId) return res.json({});

  try {
    console.log("Finance 조회 요청:", coupleId);
    const finance = await Finance.findOne({ coupleId });
    if (!finance) {
      // 초기 데이터 생성
      console.log("새로운 Finance 데이터 생성");
      const newFinance = await Finance.create({
        coupleId,
        goal: {
          targetAmount: 0,
          startDate: new Date(),
          endDate: new Date(),
          monthlyTarget: 0,
        },
        monthlyIncome: 0,
        incomes: [],
        monthlyFixedExpense: 0,
        fixedExpenses: [],
        monthlySavings: 0,
        totalSavings: 0,
        savings: [],
        availableForSavings: 0,
        goalProgress: 0,
      });
      return res.json(newFinance);
    }
    console.log("기존 Finance 데이터 반환");
    res.json(finance);
  } catch (error) {
    console.error("Finance 조회 에러:", error);
    res.status(500).json({ error: "데이터 조회 실패", details: error.message });
  }
});

// 목표 설정
router.post("/goal", async (req, res) => {
  const { coupleId, targetAmount, startDate, endDate } = req.body;
  if (!coupleId || !targetAmount) {
    return res.status(400).json({ error: "커플ID와 목표 금액이 필요합니다" });
  }

  try {
    let finance = await Finance.findOne({ coupleId });
    if (!finance) {
      finance = await Finance.create({ coupleId });
    }

    finance.goal = {
      targetAmount: Number(targetAmount),
      startDate: startDate ? new Date(startDate) : new Date(),
      endDate: endDate ? new Date(endDate) : new Date(),
      monthlyTarget: 0,
    };

    finance.calculateMonthlyTarget();
    finance.calculateGoalProgress();
    await finance.save();
    res.json(finance);
  } catch (error) {
    console.error("목표 설정 에러:", error);
    res.status(500).json({ error: "목표 설정 실패" });
  }
});

// 수익 추가
router.post("/income", async (req, res) => {
  const { coupleId, amount, category, date, description } = req.body;
  if (!coupleId || !amount || !category) {
    return res
      .status(400)
      .json({ error: "커플ID, 금액, 카테고리가 필요합니다" });
  }

  try {
    let finance = await Finance.findOne({ coupleId });
    if (!finance) {
      finance = await Finance.create({ coupleId });
    }

    const income = {
      amount: Number(amount),
      category: category,
      date: date ? new Date(date) : new Date(),
      description: description || "",
    };

    finance.incomes.push(income);

    // 이번달 수익 계산
    const now = new Date();
    finance.monthlyIncome = finance.incomes
      .filter((inc) => {
        const incDate = new Date(inc.date);
        return (
          incDate.getMonth() === now.getMonth() &&
          incDate.getFullYear() === now.getFullYear()
        );
      })
      .reduce((sum, inc) => sum + inc.amount, 0);

    finance.calculateAvailableSavings();
    await finance.save();
    res.json(finance);
  } catch (error) {
    console.error("수익 추가 에러:", error);
    res.status(500).json({ error: "수익 추가 실패" });
  }
});

// 고정 지출 추가
router.post("/fixed-expense", async (req, res) => {
  const { coupleId, name, amount, date, description } = req.body;
  if (!coupleId || !name || !amount) {
    return res.status(400).json({ error: "커플ID, 지출명, 금액이 필요합니다" });
  }

  try {
    let finance = await Finance.findOne({ coupleId });
    if (!finance) {
      finance = await Finance.create({ coupleId });
    }

    const fixedExpense = {
      name: name,
      amount: Number(amount),
      date: date ? new Date(date) : new Date(),
      description: description || "",
    };

    finance.fixedExpenses.push(fixedExpense);

    // 이번달 고정 지출 계산
    const now = new Date();
    finance.monthlyFixedExpense = finance.fixedExpenses
      .filter((exp) => {
        const expDate = new Date(exp.date);
        return (
          expDate.getMonth() === now.getMonth() &&
          expDate.getFullYear() === now.getFullYear()
        );
      })
      .reduce((sum, exp) => sum + exp.amount, 0);

    finance.calculateAvailableSavings();
    await finance.save();
    res.json(finance);
  } catch (error) {
    console.error("고정 지출 추가 에러:", error);
    res.status(500).json({ error: "고정 지출 추가 실패" });
  }
});

// 적금 추가
router.post("/savings", async (req, res) => {
  const { coupleId, amount, date, description } = req.body;
  if (!coupleId || !amount) {
    return res.status(400).json({ error: "커플ID와 금액이 필요합니다" });
  }

  try {
    let finance = await Finance.findOne({ coupleId });
    if (!finance) {
      finance = await Finance.create({ coupleId });
    }

    const savings = {
      amount: Number(amount),
      date: date ? new Date(date) : new Date(),
      description: description || "",
    };

    finance.savings.push(savings);

    // 이번달 적금 계산
    const now = new Date();
    finance.monthlySavings = finance.savings
      .filter((sav) => {
        const savDate = new Date(sav.date);
        return (
          savDate.getMonth() === now.getMonth() &&
          savDate.getFullYear() === now.getFullYear()
        );
      })
      .reduce((sum, sav) => sum + sav.amount, 0);

    // 총 적금 계산
    finance.totalSavings = finance.savings.reduce(
      (sum, sav) => sum + sav.amount,
      0
    );

    finance.calculateGoalProgress();
    await finance.save();
    res.json(finance);
  } catch (error) {
    console.error("적금 추가 에러:", error);
    res.status(500).json({ error: "적금 추가 실패" });
  }
});

// 목표 적금 설정
router.post("/target-savings", async (req, res) => {
  const { coupleId, monthlyTargetSavings } = req.body;
  if (!coupleId || monthlyTargetSavings === undefined) {
    return res
      .status(400)
      .json({ error: "커플ID와 목표 적금 금액이 필요합니다" });
  }

  try {
    let finance = await Finance.findOne({ coupleId });
    if (!finance) {
      finance = await Finance.create({ coupleId });
    }

    finance.monthlyTargetSavings = Number(monthlyTargetSavings);
    await finance.save();
    res.json(finance);
  } catch (error) {
    console.error("목표 적금 설정 에러:", error);
    res.status(500).json({ error: "목표 적금 설정 실패" });
  }
});

// 수익 수정
router.patch("/income/:id", async (req, res) => {
  const { coupleId, amount, category, name, date, description } = req.body;
  const { id } = req.params;

  if (!coupleId || !amount || !category) {
    return res
      .status(400)
      .json({ error: "커플ID, 금액, 카테고리가 필요합니다" });
  }

  try {
    const finance = await Finance.findOne({ coupleId });
    if (!finance) {
      return res.status(404).json({ error: "데이터를 찾을 수 없습니다" });
    }

    const incomeIndex = finance.incomes.findIndex(
      (inc) => inc._id.toString() === id
    );
    if (incomeIndex === -1) {
      return res.status(404).json({ error: "수익을 찾을 수 없습니다" });
    }

    // 수익 업데이트
    finance.incomes[incomeIndex] = {
      ...finance.incomes[incomeIndex],
      amount: Number(amount),
      category: category,
      name: name || "",
      date: date ? new Date(date) : new Date(),
      description: description || "",
    };

    // 이번달 수익 재계산
    const now = new Date();
    finance.monthlyIncome = finance.incomes
      .filter((inc) => {
        const incDate = new Date(inc.date);
        return (
          incDate.getMonth() === now.getMonth() &&
          incDate.getFullYear() === now.getFullYear()
        );
      })
      .reduce((sum, inc) => sum + inc.amount, 0);

    finance.calculateAvailableSavings();
    await finance.save();
    res.json(finance);
  } catch (error) {
    console.error("수익 수정 에러:", error);
    res.status(500).json({ error: "수익 수정 실패" });
  }
});

// 고정 지출 수정
router.patch("/fixed-expense/:id", async (req, res) => {
  const { coupleId, name, amount, description } = req.body;
  const { id } = req.params;

  if (!coupleId || !name || !amount) {
    return res.status(400).json({ error: "커플ID, 지출명, 금액이 필요합니다" });
  }

  try {
    const finance = await Finance.findOne({ coupleId });
    if (!finance) {
      return res.status(404).json({ error: "데이터를 찾을 수 없습니다" });
    }

    const expenseIndex = finance.fixedExpenses.findIndex(
      (exp) => exp._id.toString() === id
    );
    if (expenseIndex === -1) {
      return res.status(404).json({ error: "고정 지출을 찾을 수 없습니다" });
    }

    // 고정 지출 업데이트
    finance.fixedExpenses[expenseIndex] = {
      ...finance.fixedExpenses[expenseIndex],
      name: name,
      amount: Number(amount),
      description: description || "",
    };

    // 이번달 고정 지출 재계산
    const now = new Date();
    finance.monthlyFixedExpense = finance.fixedExpenses
      .filter((exp) => {
        const expDate = new Date(exp.date);
        return (
          expDate.getMonth() === now.getMonth() &&
          expDate.getFullYear() === now.getFullYear()
        );
      })
      .reduce((sum, exp) => sum + exp.amount, 0);

    finance.calculateAvailableSavings();
    await finance.save();
    res.json(finance);
  } catch (error) {
    console.error("고정 지출 수정 에러:", error);
    res.status(500).json({ error: "고정 지출 수정 실패" });
  }
});

// 적금 수정
router.patch("/savings/:id", async (req, res) => {
  const { coupleId, amount, date, description } = req.body;
  const { id } = req.params;

  if (!coupleId || !amount) {
    return res.status(400).json({ error: "커플ID와 금액이 필요합니다" });
  }

  try {
    const finance = await Finance.findOne({ coupleId });
    if (!finance) {
      return res.status(404).json({ error: "데이터를 찾을 수 없습니다" });
    }

    const savingIndex = finance.savings.findIndex(
      (sav) => sav._id.toString() === id
    );
    if (savingIndex === -1) {
      return res.status(404).json({ error: "적금을 찾을 수 없습니다" });
    }

    // 적금 업데이트
    finance.savings[savingIndex] = {
      ...finance.savings[savingIndex],
      amount: Number(amount),
      date: date ? new Date(date) : new Date(),
      description: description || "",
    };

    // 이번달 적금 재계산
    const now = new Date();
    finance.monthlySavings = finance.savings
      .filter((sav) => {
        const savDate = new Date(sav.date);
        return (
          savDate.getMonth() === now.getMonth() &&
          savDate.getFullYear() === now.getFullYear()
        );
      })
      .reduce((sum, sav) => sum + sav.amount, 0);

    // 총 적금 재계산
    finance.totalSavings = finance.savings.reduce(
      (sum, sav) => sum + sav.amount,
      0
    );

    finance.calculateGoalProgress();
    await finance.save();
    res.json(finance);
  } catch (error) {
    console.error("적금 수정 에러:", error);
    res.status(500).json({ error: "적금 수정 실패" });
  }
});

// 수익/고정지출/적금 삭제
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
    } else if (type === "fixed-expense") {
      finance.fixedExpenses = finance.fixedExpenses.filter(
        (exp) => exp._id.toString() !== id
      );
    } else if (type === "savings") {
      finance.savings = finance.savings.filter(
        (sav) => sav._id.toString() !== id
      );
    }

    // 재계산
    const now = new Date();

    finance.monthlyIncome = finance.incomes
      .filter((inc) => {
        const incDate = new Date(inc.date);
        return (
          incDate.getMonth() === now.getMonth() &&
          incDate.getFullYear() === now.getFullYear()
        );
      })
      .reduce((sum, inc) => sum + inc.amount, 0);

    finance.monthlyFixedExpense = finance.fixedExpenses
      .filter((exp) => {
        const expDate = new Date(exp.date);
        return (
          expDate.getMonth() === now.getMonth() &&
          expDate.getFullYear() === now.getFullYear()
        );
      })
      .reduce((sum, exp) => sum + exp.amount, 0);

    finance.monthlySavings = finance.savings
      .filter((sav) => {
        const savDate = new Date(sav.date);
        return (
          savDate.getMonth() === now.getMonth() &&
          savDate.getFullYear() === now.getFullYear()
        );
      })
      .reduce((sum, sav) => sum + sav.amount, 0);

    finance.totalSavings = finance.savings.reduce(
      (sum, sav) => sum + sav.amount,
      0
    );

    finance.calculateAvailableSavings();
    finance.calculateGoalProgress();
    await finance.save();
    res.json(finance);
  } catch (error) {
    console.error("삭제 에러:", error);
    res.status(500).json({ error: "삭제 실패" });
  }
});

module.exports = router;
