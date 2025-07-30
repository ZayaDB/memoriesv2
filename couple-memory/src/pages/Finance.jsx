import { motion, AnimatePresence } from "framer-motion";
import styled from "styled-components";
import { useState, useEffect } from "react";

const BG = styled.div`
  min-height: 100vh;
  width: 100vw;
  position: fixed;
  left: 0;
  top: 0;
  z-index: -1;
  background: linear-gradient(135deg, #ffe3ef 0%, #c7eaff 100%);
  overflow: hidden;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  padding-bottom: 80px;
`;

const Title = styled(motion.h1)`
  font-family: ${({ theme }) => theme.font.cute};
  font-size: 2rem;
  color: ${({ theme }) => theme.colors.primary};
  margin: 1em 0;
  text-align: center;
`;

const Card = styled(motion.div)`
  background: white;
  border-radius: 20px;
  padding: 1.5em;
  margin: 1em 0;
  box-shadow: ${({ theme }) => theme.shadow};
  width: 100%;
  max-width: 400px;
`;

const CardTitle = styled.h3`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 1em;
  font-family: ${({ theme }) => theme.font.cute};
  display: flex;
  align-items: center;
  gap: 0.5em;
`;

const Amount = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: ${({ positive }) => (positive ? "#4CAF50" : "#FF5722")};
  text-align: center;
  margin: 0.5em 0;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 12px;
  background: #f0f0f0;
  border-radius: 6px;
  overflow: hidden;
  margin: 1em 0;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #4caf50, #8bc34a);
  width: ${({ percentage }) => Math.min(percentage, 100)}%;
  transition: width 0.3s ease;
`;

const StatGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1em;
  margin: 1em 0;
`;

const StatItem = styled.div`
  text-align: center;
  padding: 1em;
  background: #f8f9fa;
  border-radius: 12px;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.5em;
`;

const StatValue = styled.div`
  font-size: 1.3rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary};
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1em;
  margin: 1em 0;
  flex-wrap: wrap;
  justify-content: center;
`;

const AddButton = styled(motion.button)`
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 50px;
  padding: 0.8em 2em;
  font-size: 1rem;
  cursor: pointer;
  margin: 0.5em;
  font-family: ${({ theme }) => theme.font.cute};
  box-shadow: ${({ theme }) => theme.shadow};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(255, 126, 185, 0.3);
  }
`;

const Modal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 20px;
  padding: 2em;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  max-height: 80vh;
  overflow-y: auto;
`;

const Input = styled.input`
  width: 100%;
  padding: 1em;
  border: 2px solid #f0f0f0;
  border-radius: 12px;
  font-size: 1rem;
  margin: 0.5em 0;
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 1em;
  border: 2px solid #f0f0f0;
  border-radius: 12px;
  font-size: 1rem;
  margin: 0.5em 0;
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 1em;
  border: 2px solid #f0f0f0;
  border-radius: 12px;
  font-size: 1rem;
  margin: 0.5em 0;
  resize: vertical;
  min-height: 80px;
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const API_BASE = "https://memories-production-1440.up.railway.app";

export default function Finance({ user, coupleId }) {
  const [financeData, setFinanceData] = useState({
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

  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // "goal", "income", "fixed-expense", "savings"
  const [formData, setFormData] = useState({
    amount: "",
    category: "",
    name: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    targetAmount: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    if (coupleId) {
      loadFinanceData();
    }
  }, [coupleId]);

  const loadFinanceData = async () => {
    try {
      const response = await fetch(
        `${API_BASE}/api/finance?coupleId=${coupleId}`
      );
      if (response.ok) {
        const data = await response.json();
        setFinanceData(data);
      }
      setLoading(false);
    } catch (error) {
      console.error("금융 데이터 로드 실패:", error);
      setLoading(false);
    }
  };

  const handleSetGoal = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/finance/goal`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          coupleId,
          targetAmount: Number(formData.targetAmount),
          startDate: formData.startDate,
          endDate: formData.endDate,
        }),
      });

      if (response.ok) {
        const updatedData = await response.json();
        setFinanceData(updatedData);
        setShowModal(false);
        alert("목표가 설정되었습니다!");
      }
    } catch (error) {
      console.error("목표 설정 실패:", error);
      alert("목표 설정 중 오류가 발생했습니다.");
    }
  };

  const handleAddIncome = async () => {
    if (!formData.amount || !formData.category) {
      alert("금액과 카테고리를 입력해주세요.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/finance/income`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          coupleId,
          amount: Number(formData.amount),
          category: formData.category,
          description: formData.description,
          date: formData.date,
        }),
      });

      if (response.ok) {
        const updatedData = await response.json();
        setFinanceData(updatedData);
        setShowModal(false);
        setFormData({
          amount: "",
          category: "",
          description: "",
          date: new Date().toISOString().split("T")[0],
        });
        alert("수익이 추가되었습니다!");
      }
    } catch (error) {
      console.error("수익 추가 실패:", error);
      alert("수익 추가 중 오류가 발생했습니다.");
    }
  };

  const handleAddFixedExpense = async () => {
    if (!formData.name || !formData.amount) {
      alert("지출명과 금액을 입력해주세요.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/finance/fixed-expense`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          coupleId,
          name: formData.name,
          amount: Number(formData.amount),
          description: formData.description,
          date: formData.date,
        }),
      });

      if (response.ok) {
        const updatedData = await response.json();
        setFinanceData(updatedData);
        setShowModal(false);
        setFormData({
          amount: "",
          name: "",
          description: "",
          date: new Date().toISOString().split("T")[0],
        });
        alert("고정 지출이 추가되었습니다!");
      }
    } catch (error) {
      console.error("고정 지출 추가 실패:", error);
      alert("고정 지출 추가 중 오류가 발생했습니다.");
    }
  };

  const handleAddSavings = async () => {
    if (!formData.amount) {
      alert("금액을 입력해주세요.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/finance/savings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          coupleId,
          amount: Number(formData.amount),
          description: formData.description,
          date: formData.date,
        }),
      });

      if (response.ok) {
        const updatedData = await response.json();
        setFinanceData(updatedData);
        setShowModal(false);
        setFormData({
          amount: "",
          description: "",
          date: new Date().toISOString().split("T")[0],
        });
        alert("적금이 추가되었습니다!");
      }
    } catch (error) {
      console.error("적금 추가 실패:", error);
      alert("적금 추가 중 오류가 발생했습니다.");
    }
  };

  const openModal = (type) => {
    setModalType(type);
    setShowModal(true);
    if (type === "goal") {
      setFormData({
        targetAmount: financeData.goal.targetAmount.toString(),
        startDate: financeData.goal.startDate
          ? new Date(financeData.goal.startDate).toISOString().split("T")[0]
          : "",
        endDate: financeData.goal.endDate
          ? new Date(financeData.goal.endDate).toISOString().split("T")[0]
          : "",
        amount: "",
        category: "",
        name: "",
        description: "",
        date: new Date().toISOString().split("T")[0],
      });
    } else {
      setFormData({
        amount: "",
        category: "",
        name: "",
        description: "",
        date: new Date().toISOString().split("T")[0],
      });
    }
  };

  const getRemainingDays = () => {
    if (!financeData.goal.endDate) return 0;
    const endDate = new Date(financeData.goal.endDate);
    const now = new Date();
    const diffTime = endDate - now;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getDailyTarget = () => {
    const remainingDays = getRemainingDays();
    const remainingAmount =
      financeData.goal.targetAmount - financeData.totalSavings;
    return remainingDays > 0 ? Math.ceil(remainingAmount / remainingDays) : 0;
  };

  if (loading) {
    return (
      <>
        <BG />
        <Container>
          <Title>로딩 중...</Title>
        </Container>
      </>
    );
  }

  return (
    <>
      <BG />
      <Container>
        <Title>💰 우리 돈 관리</Title>

        {/* 목표 현황 */}
        <Card
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <CardTitle>
            🎯 우리의 목표
            {financeData.goal.targetAmount === 0 && (
              <AddButton
                onClick={() => openModal("goal")}
                style={{
                  fontSize: "0.8rem",
                  padding: "0.3em 0.8em",
                  margin: 0,
                }}
              >
                설정
              </AddButton>
            )}
          </CardTitle>
          {financeData.goal.targetAmount > 0 ? (
            <>
              <Amount positive={true}>
                {financeData.goal.targetAmount.toLocaleString()}원
              </Amount>
              <ProgressBar>
                <ProgressFill percentage={financeData.goalProgress} />
              </ProgressBar>
              <StatGrid>
                <StatItem>
                  <StatLabel>현재 모은 금액</StatLabel>
                  <StatValue>
                    {financeData.totalSavings.toLocaleString()}원
                  </StatValue>
                </StatItem>
                <StatItem>
                  <StatLabel>달성률</StatLabel>
                  <StatValue>{financeData.goalProgress}%</StatValue>
                </StatItem>
                <StatItem>
                  <StatLabel>남은 기간</StatLabel>
                  <StatValue>{getRemainingDays()}일</StatValue>
                </StatItem>
                <StatItem>
                  <StatLabel>하루 목표</StatLabel>
                  <StatValue>{getDailyTarget().toLocaleString()}원</StatValue>
                </StatItem>
              </StatGrid>
            </>
          ) : (
            <div style={{ textAlign: "center", color: "#666", padding: "2em" }}>
              목표를 설정해주세요!
            </div>
          )}
        </Card>

        {/* 수익 현황 */}
        <Card
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <CardTitle>💰 이번달 수익</CardTitle>
          <Amount positive={true}>
            {financeData.monthlyIncome.toLocaleString()}원
          </Amount>
          <StatGrid>
            <StatItem>
              <StatLabel>수익 항목</StatLabel>
              <StatValue>{financeData.incomes.length}개</StatValue>
            </StatItem>
            <StatItem>
              <StatLabel>적금 가능</StatLabel>
              <StatValue>
                {financeData.availableForSavings.toLocaleString()}원
              </StatValue>
            </StatItem>
          </StatGrid>
        </Card>

        {/* 고정 지출 현황 */}
        <Card
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <CardTitle>💸 이번달 고정 지출</CardTitle>
          <Amount positive={false}>
            {financeData.monthlyFixedExpense.toLocaleString()}원
          </Amount>
          <StatGrid>
            <StatItem>
              <StatLabel>지출 항목</StatLabel>
              <StatValue>{financeData.fixedExpenses.length}개</StatValue>
            </StatItem>
            <StatItem>
              <StatLabel>수익 대비</StatLabel>
              <StatValue>
                {financeData.monthlyIncome > 0
                  ? Math.round(
                      (financeData.monthlyFixedExpense /
                        financeData.monthlyIncome) *
                        100
                    )
                  : 0}
                %
              </StatValue>
            </StatItem>
          </StatGrid>
        </Card>

        {/* 적금 현황 */}
        <Card
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <CardTitle>🏦 이번달 적금</CardTitle>
          <Amount positive={true}>
            {financeData.monthlySavings.toLocaleString()}원
          </Amount>
          <StatGrid>
            <StatItem>
              <StatLabel>적금 횟수</StatLabel>
              <StatValue>{financeData.savings.length}회</StatValue>
            </StatItem>
            <StatItem>
              <StatLabel>월 목표 대비</StatLabel>
              <StatValue>
                {financeData.goal.monthlyTarget > 0
                  ? Math.round(
                      (financeData.monthlySavings /
                        financeData.goal.monthlyTarget) *
                        100
                    )
                  : 0}
                %
              </StatValue>
            </StatItem>
          </StatGrid>
        </Card>

        <ButtonGroup>
          <AddButton
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => openModal("goal")}
          >
            🎯 목표 설정
          </AddButton>
          <AddButton
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => openModal("income")}
          >
            💰 수익 추가
          </AddButton>
          <AddButton
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => openModal("fixed-expense")}
          >
            💸 고정 지출
          </AddButton>
          <AddButton
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => openModal("savings")}
          >
            🏦 적금 추가
          </AddButton>
        </ButtonGroup>
      </Container>

      <AnimatePresence>
        {showModal && (
          <Modal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ModalContent
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <h3 style={{ marginBottom: "1em", color: "#ff7eb9" }}>
                {modalType === "goal"
                  ? "🎯 목표 설정"
                  : modalType === "income"
                  ? "💰 수익 추가"
                  : modalType === "fixed-expense"
                  ? "💸 고정 지출 추가"
                  : "🏦 적금 추가"}
              </h3>

              {modalType === "goal" ? (
                <>
                  <Input
                    type="number"
                    placeholder="목표 금액 (원)"
                    value={formData.targetAmount}
                    onChange={(e) =>
                      setFormData({ ...formData, targetAmount: e.target.value })
                    }
                  />
                  <Input
                    type="date"
                    placeholder="시작일"
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                  />
                  <Input
                    type="date"
                    placeholder="목표일"
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData({ ...formData, endDate: e.target.value })
                    }
                  />
                </>
              ) : modalType === "income" ? (
                <>
                  <Input
                    type="number"
                    placeholder="금액 (원)"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: e.target.value })
                    }
                  />
                  <Select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                  >
                    <option value="">카테고리 선택</option>
                    <option value="급여">급여</option>
                    <option value="부업">부업</option>
                    <option value="투자">투자</option>
                    <option value="기타">기타</option>
                  </Select>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                  />
                  <TextArea
                    placeholder="메모 (선택사항)"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </>
              ) : modalType === "fixed-expense" ? (
                <>
                  <Input
                    type="text"
                    placeholder="지출명 (예: 월세, 관리비)"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                  <Input
                    type="number"
                    placeholder="금액 (원)"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: e.target.value })
                    }
                  />
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                  />
                  <TextArea
                    placeholder="메모 (선택사항)"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </>
              ) : (
                <>
                  <Input
                    type="number"
                    placeholder="적금 금액 (원)"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: e.target.value })
                    }
                  />
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                  />
                  <TextArea
                    placeholder="메모 (선택사항)"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </>
              )}

              <ButtonGroup>
                <AddButton
                  onClick={() => {
                    if (modalType === "goal") handleSetGoal();
                    else if (modalType === "income") handleAddIncome();
                    else if (modalType === "fixed-expense")
                      handleAddFixedExpense();
                    else if (modalType === "savings") handleAddSavings();
                  }}
                >
                  저장
                </AddButton>
                <AddButton
                  onClick={() => setShowModal(false)}
                  style={{ background: "#ccc" }}
                >
                  취소
                </AddButton>
              </ButtonGroup>
            </ModalContent>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}
