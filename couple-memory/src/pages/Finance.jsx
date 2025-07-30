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
  padding: 20px;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 20px;
  padding: 1.5em;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  max-height: 80vh;
  overflow-y: auto;

  @media (max-width: 480px) {
    padding: 1.2em;
    margin: 10px;
    max-height: 85vh;
  }
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
  console.log("Finance компонент - user:", user);
  console.log("Finance компонент - coupleId:", coupleId);

  const [financeData, setFinanceData] = useState({
    goal: null,
    monthlyIncome: 0,
    incomes: [],
    monthlyFixedExpense: 0,
    fixedExpenses: [],
    monthlySavings: 0,
    totalSavings: 0,
    savings: [],
    availableForSavings: 0,
    monthlyTargetSavings: 0,
    goalProgress: 0,
  });
  const [modalType, setModalType] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [editItem, setEditItem] = useState(null);

  useEffect(() => {
    if (coupleId) {
      loadFinanceData();
    }
  }, [coupleId]);

  const loadFinanceData = async () => {
    try {
      console.log("Санхүүгийн мэдээлэл ачаалах - coupleId:", coupleId);

      const response = await fetch(
        `https://memories-production-1440.up.railway.app/api/finance?coupleId=${coupleId}`
      );

      console.log(
        "Санхүүгийн мэдээлэл ачаалах - хариу:",
        response.status,
        response.statusText
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Санхүүгийн мэдээлэл ачаалах - амжилттай:", data);
        setFinanceData(data);
      } else {
        const errorData = await response.json();
        console.error("Санхүүгийн мэдээлэл ачаалах - алдаа:", errorData);
      }
    } catch (error) {
      console.error("Санхүүгийн мэдээлэл ачаалахад алдаа:", error);
    }
  };

  const handleSetGoal = async () => {
    try {
      const response = await fetch(
        "https://memories-production-1440.up.railway.app/api/finance/goal",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            coupleId,
            targetAmount: parseInt(formData.targetAmount),
            startDate: formData.startDate,
            endDate: formData.endDate,
          }),
        }
      );
      if (response.ok) {
        alert("Зорилго тохируулагдлаа!");
        setModalOpen(false);
        loadFinanceData();
      }
    } catch (error) {
      console.error("Зорилго тохируулах алдаа:", error);
      alert("Зорилго тохируулахад алдаа гарлаа.");
    }
  };

  const handleAddIncome = async () => {
    try {
      console.log("Орлого нэмэх - илгээх өгөгдөл:", {
        coupleId,
        amount: parseInt(formData.amount),
        category: formData.category,
        name: formData.name,
        date: formData.date,
        description: formData.description,
      });

      const response = await fetch(
        "https://memories-production-1440.up.railway.app/api/finance/income",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            coupleId,
            amount: parseInt(formData.amount),
            category: formData.category,
            name: formData.name,
            date: formData.date,
            description: formData.description,
          }),
        }
      );

      console.log(
        "Орлого нэмэх - хариу:",
        response.status,
        response.statusText
      );

      if (response.ok) {
        const responseData = await response.json();
        console.log("Орлого нэмэх - амжилттай:", responseData);
        alert("Орлого нэмэгдлээ!");
        setModalOpen(false);
        loadFinanceData();
      } else {
        const errorData = await response.json();
        console.error("Орлого нэмэх - алдаа:", errorData);
        alert(
          `Орлого нэмэхэд алдаа гарлаа: ${errorData.message || "Unknown error"}`
        );
      }
    } catch (error) {
      console.error("Орлого нэмэх алдаа:", error);
      alert("Орлого нэмэхэд алдаа гарлаа.");
    }
  };

  const handleAddFixedExpense = async () => {
    if (!formData.name || !formData.amount) {
      alert("Зардлын нэр болон дүнг оруулна уу.");
      return;
    }
    try {
      console.log("Тогтмол зардал нэмэх - илгээх өгөгдөл:", {
        coupleId,
        amount: parseInt(formData.amount),
        name: formData.name,
        description: formData.description,
      });

      const response = await fetch(
        "https://memories-production-1440.up.railway.app/api/finance/fixed-expense",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            coupleId,
            amount: parseInt(formData.amount),
            name: formData.name,
            description: formData.description,
          }),
        }
      );

      console.log(
        "Тогтмол зардал нэмэх - хариу:",
        response.status,
        response.statusText
      );

      if (response.ok) {
        const responseData = await response.json();
        console.log("Тогтмол зардал нэмэх - амжилттай:", responseData);
        alert("Тогтмол зардал нэмэгдлээ!");
        setModalOpen(false);
        loadFinanceData();
      } else {
        const errorData = await response.json();
        console.error("Тогтмол зардал нэмэх - алдаа:", errorData);
        alert(
          `Тогтмол зардал нэмэхэд алдаа гарлаа: ${
            errorData.message || "Unknown error"
          }`
        );
      }
    } catch (error) {
      console.error("Тогтмол зардал нэмэх алдаа:", error);
      alert("Тогтмол зардал нэмэхэд алдаа гарлаа.");
    }
  };

  const handleAddSavings = async () => {
    try {
      console.log("Хадгаламж нэмэх - илгээх өгөгдөл:", {
        coupleId,
        amount: parseInt(formData.amount),
        date: formData.date,
        description: formData.description,
      });

      const response = await fetch(
        "https://memories-production-1440.up.railway.app/api/finance/savings",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            coupleId,
            amount: parseInt(formData.amount),
            date: formData.date,
            description: formData.description,
          }),
        }
      );

      console.log(
        "Хадгаламж нэмэх - хариу:",
        response.status,
        response.statusText
      );

      if (response.ok) {
        const responseData = await response.json();
        console.log("Хадгаламж нэмэх - амжилттай:", responseData);
        alert("Хадгаламж нэмэгдлээ!");
        setModalOpen(false);
        loadFinanceData();
      } else {
        const errorData = await response.json();
        console.error("Хадгаламж нэмэх - алдаа:", errorData);
        alert(
          `Хадгаламж нэмэхэд алдаа гарлаа: ${
            errorData.message || "Unknown error"
          }`
        );
      }
    } catch (error) {
      console.error("Хадгаламж нэмэх алдаа:", error);
      alert("Хадгаламж нэмэхэд алдаа гарлаа.");
    }
  };

  // 목표 적금 설정
  const handleSetTargetSavings = async () => {
    try {
      const response = await fetch(
        "https://memories-production-1440.up.railway.app/api/finance/target-savings",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            coupleId,
            monthlyTargetSavings: parseInt(formData.monthlyTargetSavings),
          }),
        }
      );
      if (response.ok) {
        alert("Сарын зорилгын хадгаламж тохируулагдлаа!");
        setModalOpen(false);
        loadFinanceData();
      }
    } catch (error) {
      console.error("목표 적금 설정 에러:", error);
      alert("목표 적금 설정에 실패했습니다.");
    }
  };

  // 수정 함수들
  const handleEditGoal = async () => {
    try {
      const response = await fetch(
        "https://memories-production-1440.up.railway.app/api/finance/goal",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            coupleId,
            targetAmount: parseInt(formData.targetAmount),
            startDate: formData.startDate,
            endDate: formData.endDate,
          }),
        }
      );
      if (response.ok) {
        alert("Зорилго шинэчлэгдлээ!");
        setModalOpen(false);
        setEditMode(false);
        setEditItem(null);
        loadFinanceData();
      }
    } catch (error) {
      console.error("Зорилго шинэчлэх алдаа:", error);
      alert("Зорилго шинэчлэхэд алдаа гарлаа.");
    }
  };

  const handleEditIncome = async () => {
    try {
      const response = await fetch(
        `https://memories-production-1440.up.railway.app/api/finance/income/${editItem._id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            coupleId,
            amount: parseInt(formData.amount),
            category: formData.category,
            name: formData.name,
            date: formData.date,
            description: formData.description,
          }),
        }
      );

      if (response.ok) {
        alert("Орлого шинэчлэгдлээ!");
        setModalOpen(false);
        setEditMode(false);
        setEditItem(null);
        loadFinanceData();
      } else {
        const errorData = await response.json();
        alert(
          `Орлого шинэчлэхэд алдаа гарлаа: ${
            errorData.message || "Unknown error"
          }`
        );
      }
    } catch (error) {
      console.error("Орлого шинэчлэх алдаа:", error);
      alert("Орлого шинэчлэхэд алдаа гарлаа.");
    }
  };

  const handleEditFixedExpense = async () => {
    try {
      const response = await fetch(
        `https://memories-production-1440.up.railway.app/api/finance/fixed-expense/${editItem._id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            coupleId,
            amount: parseInt(formData.amount),
            name: formData.name,
            description: formData.description,
          }),
        }
      );

      if (response.ok) {
        alert("Тогтмол зардал шинэчлэгдлээ!");
        setModalOpen(false);
        setEditMode(false);
        setEditItem(null);
        loadFinanceData();
      } else {
        const errorData = await response.json();
        alert(
          `Тогтмол зардал шинэчлэхэд алдаа гарлаа: ${
            errorData.message || "Unknown error"
          }`
        );
      }
    } catch (error) {
      console.error("Тогтмол зардал шинэчлэх алдаа:", error);
      alert("Тогтмол зардал шинэчлэхэд алдаа гарлаа.");
    }
  };

  const handleEditSavings = async () => {
    try {
      const response = await fetch(
        `https://memories-production-1440.up.railway.app/api/finance/savings/${editItem._id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            coupleId,
            amount: parseInt(formData.amount),
            date: formData.date,
            description: formData.description,
          }),
        }
      );

      if (response.ok) {
        alert("Хадгаламж шинэчлэгдлээ!");
        setModalOpen(false);
        setEditMode(false);
        setEditItem(null);
        loadFinanceData();
      } else {
        const errorData = await response.json();
        alert(
          `Хадгаламж шинэчлэхэд алдаа гарлаа: ${
            errorData.message || "Unknown error"
          }`
        );
      }
    } catch (error) {
      console.error("Хадгаламж шинэчлэх алдаа:", error);
      alert("Хадгаламж шинэчлэхэд алдаа гарлаа.");
    }
  };

  const openModal = (type, item = null) => {
    setModalType(type);
    setModalOpen(true);
    setEditMode(!!item);
    setEditItem(item);

    if (type === "goal") {
      if (item) {
        // 수정 모드
        setFormData({
          targetAmount: item.targetAmount?.toString() || "",
          startDate: item.startDate
            ? new Date(item.startDate).toISOString().split("T")[0]
            : "",
          endDate: item.endDate
            ? new Date(item.endDate).toISOString().split("T")[0]
            : "",
        });
      } else {
        // 새로 추가 모드
        setFormData({
          targetAmount: "",
          startDate: "",
          endDate: "",
        });
      }
    } else if (type === "target-savings") {
      setFormData({
        monthlyTargetSavings:
          financeData.monthlyTargetSavings?.toString() || "",
      });
    } else if (type === "income") {
      if (item) {
        // 수정 모드
        setFormData({
          amount: item.amount?.toString() || "",
          category: item.category || "salary",
          name: item.name || "",
          date: item.date
            ? new Date(item.date).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0],
          description: item.description || "",
        });
      } else {
        // 새로 추가 모드
        setFormData({
          amount: "",
          category: "salary",
          name: "",
          date: new Date().toISOString().split("T")[0],
          description: "",
        });
      }
    } else if (type === "fixed-expense") {
      if (item) {
        // 수정 모드
        setFormData({
          amount: item.amount?.toString() || "",
          name: item.name || "",
          description: item.description || "",
        });
      } else {
        // 새로 추가 모드
        setFormData({
          amount: "",
          name: "",
          description: "",
        });
      }
    } else if (type === "savings") {
      if (item) {
        // 수정 모드
        setFormData({
          amount: item.amount?.toString() || "",
          date: item.date
            ? new Date(item.date).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0],
          description: item.description || "",
        });
      } else {
        // 새로 추가 모드
        setFormData({
          amount: "",
          date: new Date().toISOString().split("T")[0],
          description: "",
        });
      }
    }
  };

  // 수정 버튼 클릭 핸들러들
  const handleEditGoalClick = () => {
    openModal("goal", financeData.goal);
  };

  const handleEditIncomeClick = (income) => {
    openModal("income", income);
  };

  const handleEditFixedExpenseClick = (expense) => {
    openModal("fixed-expense", expense);
  };

  const handleEditSavingsClick = (saving) => {
    openModal("savings", saving);
  };

  const getRemainingDays = () => {
    if (!financeData.goal?.endDate) return 0;
    const end = new Date(financeData.goal.endDate);
    const now = new Date();
    return Math.max(0, Math.ceil((end - now) / (1000 * 60 * 60 * 24)));
  };

  const getDailyTarget = () => {
    if (!financeData.goal?.targetAmount || !financeData.goal?.endDate) return 0;
    const remaining = getRemainingDays();
    if (remaining === 0) return 0;
    return Math.ceil(
      (financeData.goal.targetAmount - financeData.totalSavings) / remaining
    );
  };

  return (
    <>
      <BG />
      <Container>
        <Title>💰 Бидний Санхүү</Title>

        {/* 목표 현황 */}
        <Card
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <CardTitle>🎯 Бидний зорилго</CardTitle>
          {financeData.goal ? (
            <>
              <Amount positive>
                {financeData.goal.targetAmount?.toLocaleString()}₮
              </Amount>
              <ProgressBar>
                <ProgressFill percentage={financeData.goalProgress} />
              </ProgressBar>
              <StatGrid>
                <StatItem>
                  <StatLabel>Биелэлт</StatLabel>
                  <StatValue>{Math.round(financeData.goalProgress)}%</StatValue>
                </StatItem>
                <StatItem>
                  <StatLabel>Өдөр тутмын зорилго</StatLabel>
                  <StatValue>{getDailyTarget().toLocaleString()}₮</StatValue>
                </StatItem>
              </StatGrid>

              {/* 목표 진행 상황 상세 */}
              <div
                style={{
                  marginTop: "1em",
                  padding: "1em",
                  background: "#f8f9fa",
                  borderRadius: "12px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "0.5em",
                  }}
                >
                  <span style={{ fontWeight: "bold", color: "#4CAF50" }}>
                    📊 Одоогийн хадгаламж:
                  </span>
                  <span style={{ fontWeight: "bold", color: "#4CAF50" }}>
                    {financeData.totalSavings?.toLocaleString()}₮
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "0.5em",
                  }}
                >
                  <span style={{ color: "#666" }}>⏳ Үлдсэн дүн:</span>
                  <span style={{ fontWeight: "bold", color: "#FF9800" }}>
                    {Math.max(
                      0,
                      financeData.goal.targetAmount - financeData.totalSavings
                    )?.toLocaleString()}
                    ₮
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={{ color: "#666" }}>
                    💰 Энэ сар хадгалах боломж:
                  </span>
                  <span style={{ fontWeight: "bold", color: "#2196F3" }}>
                    {financeData.availableForSavings?.toLocaleString()}₮
                  </span>
                </div>
              </div>

              <div
                style={{
                  textAlign: "center",
                  color: "#666",
                  fontSize: "0.9rem",
                  marginTop: "1em",
                }}
              >
                {getRemainingDays()} хоног үлдлээ
              </div>
              {financeData.goal && financeData.availableForSavings > 0 && (
                <div
                  style={{
                    marginTop: "0.8em",
                    padding: "0.8em",
                    background: "#e8f5e8",
                    borderRadius: "8px",
                    border: "1px solid #4CAF50",
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.9rem",
                      color: "#2E7D32",
                      fontWeight: "bold",
                      marginBottom: "0.3em",
                    }}
                  >
                    💡 Зорилго хурдан биелүүлэх зөвлөмж:
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "#666" }}>
                    Энэ сард{" "}
                    {Math.min(
                      financeData.availableForSavings,
                      financeData.goal.targetAmount - financeData.totalSavings
                    )?.toLocaleString()}
                    ₮ хадгалбал зорилгын{" "}
                    {(
                      (Math.min(
                        financeData.availableForSavings,
                        financeData.goal.targetAmount - financeData.totalSavings
                      ) /
                        (financeData.goal.targetAmount -
                          financeData.totalSavings)) *
                      100
                    )?.toFixed(1)}
                    % биелнэ!
                  </div>
                </div>
              )}
              <div style={{ textAlign: "center", marginTop: "1em" }}>
                <AddButton
                  onClick={handleEditGoalClick}
                  style={{
                    background: "#ffb3d1",
                    fontSize: "0.9rem",
                    padding: "0.5em 1em",
                  }}
                >
                  ✏️ Засах
                </AddButton>
              </div>
            </>
          ) : (
            <div style={{ textAlign: "center", color: "#666" }}>
              Зорилгоо тохируулна уу!
            </div>
          )}
        </Card>

        {/* 수익 현황 */}
        <Card
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <CardTitle>💰 Энэ сарын орлого</CardTitle>
          <Amount positive>
            {financeData.monthlyIncome?.toLocaleString()}₮
          </Amount>
          <StatGrid>
            <StatItem>
              <StatLabel>Орлогын тоо</StatLabel>
              <StatValue>{financeData.incomes?.length || 0}</StatValue>
            </StatItem>
            <StatItem>
              <StatLabel>Хадгалах боломж</StatLabel>
              <StatValue>
                {financeData.availableForSavings?.toLocaleString()}₮
              </StatValue>
            </StatItem>
          </StatGrid>

          {/* 수익 리스트 */}
          {financeData.incomes && financeData.incomes.length > 0 && (
            <div style={{ marginTop: "1em" }}>
              <h4
                style={{
                  fontSize: "1rem",
                  color: "#666",
                  marginBottom: "0.5em",
                }}
              >
                Орлогын жагсаалт:
              </h4>
              {financeData.incomes.map((income, index) => (
                <div
                  key={income._id || index}
                  style={{
                    background: "#f8f9fa",
                    padding: "0.8em",
                    borderRadius: "8px",
                    marginBottom: "0.5em",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: "bold", color: "#4CAF50" }}>
                      {income.name || "Орлого"} -{" "}
                      {income.amount?.toLocaleString()}₮
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "#666" }}>
                      {income.category} •{" "}
                      {income.date
                        ? new Date(income.date).toLocaleDateString("mn-MN")
                        : ""}
                    </div>
                    {income.description && (
                      <div
                        style={{
                          fontSize: "0.8rem",
                          color: "#888",
                          fontStyle: "italic",
                        }}
                      >
                        {income.description}
                      </div>
                    )}
                  </div>
                  <AddButton
                    onClick={() => handleEditIncomeClick(income)}
                    style={{
                      background: "#ffb3d1",
                      fontSize: "0.8rem",
                      padding: "0.3em 0.8em",
                      margin: 0,
                    }}
                  >
                    ✏️
                  </AddButton>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* 고정 지출 현황 */}
        <Card
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <CardTitle>💸 Энэ сарын тогтмол зардал</CardTitle>
          <Amount positive={false}>
            {financeData.monthlyFixedExpense?.toLocaleString()}₮
          </Amount>
          <StatGrid>
            <StatItem>
              <StatLabel>Зардлын тоо</StatLabel>
              <StatValue>{financeData.fixedExpenses?.length || 0}</StatValue>
            </StatItem>
            <StatItem>
              <StatLabel>Орлогод харьцуулбал</StatLabel>
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

          {/* 고정 지출 리스트 */}
          {financeData.fixedExpenses &&
            financeData.fixedExpenses.length > 0 && (
              <div style={{ marginTop: "1em" }}>
                <h4
                  style={{
                    fontSize: "1rem",
                    color: "#666",
                    marginBottom: "0.5em",
                  }}
                >
                  Зардлын жагсаалт:
                </h4>
                {financeData.fixedExpenses.map((expense, index) => (
                  <div
                    key={expense._id || index}
                    style={{
                      background: "#f8f9fa",
                      padding: "0.8em",
                      borderRadius: "8px",
                      marginBottom: "0.5em",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: "bold", color: "#FF5722" }}>
                        {expense.name} - {expense.amount?.toLocaleString()}₮
                      </div>
                      <div style={{ fontSize: "0.8rem", color: "#666" }}>
                        {expense.date
                          ? new Date(expense.date).toLocaleDateString("mn-MN")
                          : ""}
                      </div>
                      {expense.description && (
                        <div
                          style={{
                            fontSize: "0.8rem",
                            color: "#888",
                            fontStyle: "italic",
                          }}
                        >
                          {expense.description}
                        </div>
                      )}
                    </div>
                    <AddButton
                      onClick={() => handleEditFixedExpenseClick(expense)}
                      style={{
                        background: "#ffb3d1",
                        fontSize: "0.8rem",
                        padding: "0.3em 0.8em",
                        margin: 0,
                      }}
                    >
                      ✏️
                    </AddButton>
                  </div>
                ))}
              </div>
            )}
        </Card>

        {/* 액션 버튼들 */}
        <div
          style={{
            display: "flex",
            gap: "1em",
            flexWrap: "wrap",
            justifyContent: "center",
            marginTop: "2em",
          }}
        >
          <AddButton
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => openModal("goal")}
          >
            🎯 Зорилго тохируулах
          </AddButton>
          <AddButton
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => openModal("income")}
          >
            💰 Орлого нэмэх
          </AddButton>
          <AddButton
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => openModal("fixed-expense")}
          >
            💸 Тогтмол зардал
          </AddButton>
          <AddButton
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => openModal("savings")}
          >
            🏦 Хадгаламж нэмэх
          </AddButton>
        </div>

        {/* 모달 */}
        <AnimatePresence>
          {modalOpen && (
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
                <h3
                  style={{
                    marginBottom: "1em",
                    color: "#ff7eb9",
                    fontSize: "1.2rem",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  {modalType === "goal"
                    ? "🎯 Зорилго тохируулах"
                    : modalType === "target-savings"
                    ? "🎯 Зорилгын хадгаламж тохируулах"
                    : modalType === "income"
                    ? "💰 Орлого нэмэх"
                    : modalType === "fixed-expense"
                    ? "💸 Тогтмол зардал нэмэх"
                    : "🏦 Хадгаламж нэмэх"}
                </h3>

                {modalType === "goal" && (
                  <>
                    <Input
                      type="number"
                      placeholder="Зорилгын дүн (₮)"
                      value={formData.targetAmount || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          targetAmount: e.target.value,
                        })
                      }
                    />
                    <Input
                      type="date"
                      placeholder="Эхлэх огноо"
                      value={formData.startDate || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, startDate: e.target.value })
                      }
                    />
                    <Input
                      type="date"
                      placeholder="Зорилгын огноо"
                      value={formData.endDate || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, endDate: e.target.value })
                      }
                    />
                  </>
                )}

                {modalType === "target-savings" && (
                  <>
                    <Input
                      type="number"
                      placeholder="Зорилгын хадгаламжийн дүн (₮)"
                      value={formData.monthlyTargetSavings || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          monthlyTargetSavings: e.target.value,
                        })
                      }
                    />
                  </>
                )}

                {modalType === "income" && (
                  <>
                    <Select
                      value={formData.category || "salary"}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                    >
                      <option value="salary">Цалин</option>
                      <option value="bonus">Нэмэлт</option>
                      <option value="business">Бизнес</option>
                      <option value="investment">Хөрөнгө оруулалт</option>
                      <option value="other">Бусад</option>
                    </Select>
                    <Input
                      type="number"
                      placeholder="Орлогын дүн (₮)"
                      value={formData.amount || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, amount: e.target.value })
                      }
                    />
                    <Input
                      type="text"
                      placeholder="Орлогын нэр"
                      value={formData.name || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                    <Input
                      type="date"
                      placeholder="Орлогын огноо"
                      value={formData.date || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, date: e.target.value })
                      }
                    />
                    <TextArea
                      placeholder="Тайлбар (сонгоно уу)"
                      value={formData.description || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                    />
                  </>
                )}

                {modalType === "fixed-expense" && (
                  <>
                    <Input
                      type="text"
                      placeholder="Зардлын нэр (жишээ: сар бүрийн төлбөр, удирдлагын төлбөр)"
                      value={formData.name || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                    <Input
                      type="number"
                      placeholder="Зардлын дүн (₮)"
                      value={formData.amount || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, amount: e.target.value })
                      }
                    />
                    <TextArea
                      placeholder="Тайлбар (сонгоно уу)"
                      value={formData.description || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                    />
                  </>
                )}

                {modalType === "savings" && (
                  <>
                    <Input
                      type="number"
                      placeholder="Хадгаламжийн дүн (₮)"
                      value={formData.amount || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, amount: e.target.value })
                      }
                    />
                    <Input
                      type="date"
                      placeholder="Хадгаламжийн огноо"
                      value={formData.date || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, date: e.target.value })
                      }
                    />
                    <TextArea
                      placeholder="Тайлбар (сонгоно уу)"
                      value={formData.description || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                    />
                  </>
                )}

                <ButtonGroup
                  style={{
                    display: "flex",
                    gap: "0.8em",
                    marginTop: "1.5em",
                    flexWrap: "wrap",
                    justifyContent: "center",
                  }}
                >
                  <AddButton
                    onClick={
                      editMode
                        ? modalType === "goal"
                          ? handleEditGoal
                          : modalType === "income"
                          ? handleEditIncome
                          : modalType === "fixed-expense"
                          ? handleEditFixedExpense
                          : handleEditSavings
                        : modalType === "goal"
                        ? handleSetGoal
                        : modalType === "target-savings"
                        ? handleSetTargetSavings
                        : modalType === "income"
                        ? handleAddIncome
                        : modalType === "fixed-expense"
                        ? handleAddFixedExpense
                        : handleAddSavings
                    }
                    style={{
                      minWidth: "120px",
                      padding: "0.8em 1.5em",
                    }}
                  >
                    {editMode ? "Шинэчлэх" : "Хадгалах"}
                  </AddButton>
                  <AddButton
                    onClick={() => {
                      setModalOpen(false);
                      setEditMode(false);
                      setEditItem(null);
                    }}
                    style={{
                      minWidth: "120px",
                      padding: "0.8em 1.5em",
                      background: "#ccc",
                    }}
                  >
                    Цуцлах
                  </AddButton>
                </ButtonGroup>
              </ModalContent>
            </Modal>
          )}
        </AnimatePresence>
      </Container>
    </>
  );
}
