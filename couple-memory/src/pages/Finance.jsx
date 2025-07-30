import { motion, AnimatePresence } from "framer-motion";
import styled from "styled-components";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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
    monthlyIncome: 0,
    weeklyIncome: 0,
    monthlyExpense: 0,
    monthlyBudget: 0,
    savings: 0,
    savingsGoal: 0,
    expenses: [],
    incomes: [],
  });

  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // "income" or "expense" or "goals"
  const [formData, setFormData] = useState({
    amount: "",
    category: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
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

  const handleAddIncome = async () => {
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
      }
    } catch (error) {
      console.error("수익 추가 실패:", error);
    }
  };

  const handleAddExpense = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/finance/expense`, {
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
      }
    } catch (error) {
      console.error("지출 추가 실패:", error);
    }
  };

  const handleUpdateGoals = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/finance/goals`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          coupleId,
          monthlyBudget: Number(formData.amount),
          savingsGoal: Number(formData.savingsGoal || 0),
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
      }
    } catch (error) {
      console.error("목표 설정 실패:", error);
    }
  };

  const openModal = (type) => {
    setModalType(type);
    setShowModal(true);
    if (type === "goals") {
      setFormData({
        amount: financeData.monthlyBudget.toString(),
        savingsGoal: financeData.savingsGoal.toString(),
        category: "",
        description: "",
        date: new Date().toISOString().split("T")[0],
      });
    } else {
      setFormData({
        amount: "",
        category: "",
        description: "",
        date: new Date().toISOString().split("T")[0],
      });
    }
  };

  const getProgressPercentage = (current, goal) => {
    return goal > 0 ? (current / goal) * 100 : 0;
  };

  const getRemainingBudget = () => {
    return financeData.monthlyBudget - financeData.monthlyExpense;
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
        <Title>💰 금융관리</Title>

        <Card
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <CardTitle>이번달 수익</CardTitle>
          <Amount positive={true}>
            {financeData.monthlyIncome.toLocaleString()}원
          </Amount>
          <StatGrid>
            <StatItem>
              <StatLabel>이번주 수익</StatLabel>
              <StatValue>
                {financeData.weeklyIncome.toLocaleString()}원
              </StatValue>
            </StatItem>
            <StatItem>
              <StatLabel>수익 항목</StatLabel>
              <StatValue>{financeData.incomes.length}개</StatValue>
            </StatItem>
          </StatGrid>
        </Card>

        <Card
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <CardTitle>이번달 지출</CardTitle>
          <Amount positive={false}>
            {financeData.monthlyExpense.toLocaleString()}원
          </Amount>
          <ProgressBar>
            <ProgressFill
              percentage={getProgressPercentage(
                financeData.monthlyExpense,
                financeData.monthlyBudget
              )}
            />
          </ProgressBar>
          <StatGrid>
            <StatItem>
              <StatLabel>예산</StatLabel>
              <StatValue>
                {financeData.monthlyBudget.toLocaleString()}원
              </StatValue>
            </StatItem>
            <StatItem>
              <StatLabel>남은 예산</StatLabel>
              <StatValue
                style={{
                  color: getRemainingBudget() > 0 ? "#4CAF50" : "#FF5722",
                }}
              >
                {getRemainingBudget().toLocaleString()}원
              </StatValue>
            </StatItem>
          </StatGrid>
        </Card>

        <Card
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <CardTitle>저축 현황</CardTitle>
          <Amount positive={true}>
            {financeData.savings.toLocaleString()}원
          </Amount>
          <ProgressBar>
            <ProgressFill
              percentage={getProgressPercentage(
                financeData.savings,
                financeData.savingsGoal
              )}
            />
          </ProgressBar>
          <StatGrid>
            <StatItem>
              <StatLabel>목표</StatLabel>
              <StatValue>
                {financeData.savingsGoal.toLocaleString()}원
              </StatValue>
            </StatItem>
            <StatItem>
              <StatLabel>달성률</StatLabel>
              <StatValue>
                {Math.round(
                  getProgressPercentage(
                    financeData.savings,
                    financeData.savingsGoal
                  )
                )}
                %
              </StatValue>
            </StatItem>
          </StatGrid>
        </Card>

        <ButtonGroup>
          <AddButton
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => openModal("income")}
          >
            + 수익 추가
          </AddButton>
          <AddButton
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => openModal("expense")}
          >
            + 지출 추가
          </AddButton>
          <AddButton
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => openModal("goals")}
          >
            목표 설정
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
                {modalType === "income"
                  ? "수익 추가"
                  : modalType === "expense"
                  ? "지출 추가"
                  : "목표 설정"}
              </h3>

              {modalType === "goals" ? (
                <>
                  <Input
                    type="number"
                    placeholder="월 예산 (원)"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: e.target.value })
                    }
                  />
                  <Input
                    type="number"
                    placeholder="저축 목표 (원)"
                    value={formData.savingsGoal}
                    onChange={(e) =>
                      setFormData({ ...formData, savingsGoal: e.target.value })
                    }
                  />
                </>
              ) : (
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
                    {modalType === "income" ? (
                      <>
                        <option value="급여">급여</option>
                        <option value="부업">부업</option>
                        <option value="투자">투자</option>
                        <option value="기타">기타</option>
                      </>
                    ) : (
                      <>
                        <option value="식비">식비</option>
                        <option value="교통비">교통비</option>
                        <option value="쇼핑">쇼핑</option>
                        <option value="문화생활">문화생활</option>
                        <option value="주거비">주거비</option>
                        <option value="기타">기타</option>
                      </>
                    )}
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
              )}

              <ButtonGroup>
                <AddButton
                  onClick={() => {
                    if (modalType === "income") handleAddIncome();
                    else if (modalType === "expense") handleAddExpense();
                    else if (modalType === "goals") handleUpdateGoals();
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
