import styled from "styled-components";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const API_URL = "https://memories-production-1440.up.railway.app/api/plans";

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
const TopIcon = styled.div`
  font-size: 2.2em;
  margin-bottom: 0.2em;
`;
const MenuGuide = styled.div`
  margin-top: 2em;
  color: #aaa;
  font-size: 1em;
  text-align: center;
  opacity: 0.8;
`;
const Container = styled.div`
  min-height: 80vh;
  padding: 2em 1em 70px 1em;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const Title = styled.h2`
  font-family: ${({ theme }) => theme.font.cute};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 1em;
`;
const Guide = styled.div`
  color: ${({ theme }) => theme.colors.primary};
  background: ${({ theme }) => theme.colors.secondary};
  border-radius: 12px;
  padding: 1.2em 1.5em;
  box-shadow: ${({ theme }) => theme.shadow};
  text-align: center;
  margin-bottom: 2em;
`;
const List = styled.ul`
  width: 100%;
  max-width: 400px;
  padding: 0;
  margin: 0;
  list-style: none;
`;
const Item = styled(motion.li)`
  background: #fff8fc;
  border-radius: 12px;
  box-shadow: ${({ theme }) => theme.shadow};
  margin-bottom: 1em;
  padding: 1em 1.2em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
`;
const AddForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.7em;
  margin-bottom: 2em;
  width: 100%;
  max-width: 400px;
`;
const Input = styled.input`
  border-radius: 10px;
  border: 1px solid #ffe3ef;
  padding: 0.7em;
  font-size: 1em;
`;
const Select = styled.select`
  border-radius: 10px;
  border: 1px solid #ffe3ef;
  padding: 0.7em;
  font-size: 1em;
`;
const AddBtn = styled(motion.button)`
  background: #ff7eb9;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 0.7em 1.2em;
  font-size: 1em;
  cursor: pointer;
  font-family: ${({ theme }) => theme.font.cute};
  &:hover {
    background: #ffb3d1;
  }
`;
const DateText = styled.span`
  color: #aaa;
  font-size: 0.95em;
`;
const Place = styled.span`
  color: #ff7eb9;
  font-size: 1em;
  margin-left: 0.5em;
`;
const DoneBadge = styled.span`
  background: #ffe3ef;
  color: #ff7eb9;
  border-radius: 8px;
  padding: 0.2em 0.7em;
  font-size: 0.9em;
  margin-left: 0.5em;
`;

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function Planner() {
  const [plans, setPlans] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    place: "",
    type: "trip",
  });
  const [loading, setLoading] = useState(false);
  const [hearts, setHearts] = useState([]);

  // 로그인한 유저의 coupleId 추출
  const coupleId = (() => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      return user?.coupleId;
    } catch {
      return null;
    }
  })();

  const fetchPlans = async () => {
    setLoading(true);
    if (!coupleId) return setLoading(false);
    const res = await fetch(`${API_URL}?coupleId=${coupleId}`);
    const data = await res.json();
    setPlans(data);
    setLoading(false);
  };
  useEffect(() => {
    fetchPlans();
    const timer = setInterval(() => popHeart(), 2200);
    return () => clearInterval(timer);
  }, [coupleId]);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.startDate) return;
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, coupleId }),
    });
    setForm({
      title: "",
      description: "",
      startDate: "",
      endDate: "",
      place: "",
      type: "trip",
    });
    fetchPlans();
  };

  const popHeart = () => {
    const id = Math.random().toString(36).slice(2);
    const x = Math.random() * 80 + 10;
    const y = Math.random() * 60 + 20;
    setHearts((prev) => [...prev, { id, x, y }]);
    setTimeout(
      () => setHearts((prev) => prev.filter((h) => h.id !== id)),
      1200
    );
  };

  return (
    <>
      <BG />
      <Container>
        <AnimatePresence>
          {hearts.map((h) => (
            <motion.div
              key={h.id}
              initial={{ scale: 0, opacity: 1, x: `${h.x}vw`, y: `${h.y}vh` }}
              animate={{ scale: 1.2, opacity: 0.7, y: `${h.y - 10}vh` }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 1.2 }}
              style={{
                left: 0,
                top: 0,
                position: "fixed",
                fontSize: "2.2em",
                pointerEvents: "none",
                zIndex: 99999,
              }}
            >
              {Math.random() > 0.5 ? "💖" : "✨"}
            </motion.div>
          ))}
        </AnimatePresence>
        <TopIcon>✈️</TopIcon>
        <Title>기념일 & 여행 플래너</Title>
        <Guide>우리의 특별한 날과 여행을 함께 계획해보자!</Guide>
        <AddForm onSubmit={handleAdd}>
          <Input
            name="title"
            placeholder="제목 (예: 일본 여행)"
            value={form.title}
            onChange={handleChange}
            required
          />
          <Input
            name="description"
            placeholder="메모/계획"
            value={form.description}
            onChange={handleChange}
          />
          <Input
            name="place"
            placeholder="장소 (예: 오사카)"
            value={form.place}
            onChange={handleChange}
          />
          <div style={{ display: "flex", gap: 8 }}>
            <Input
              name="startDate"
              type="date"
              value={form.startDate}
              onChange={handleChange}
              required
              style={{ flex: 1 }}
            />
            <Input
              name="endDate"
              type="date"
              value={form.endDate}
              onChange={handleChange}
              style={{ flex: 1 }}
            />
          </div>
          <Select name="type" value={form.type} onChange={handleChange}>
            <option value="trip">여행</option>
            <option value="anniversary">기념일</option>
            <option value="date">데이트</option>
            <option value="etc">기타</option>
          </Select>
          <AddBtn type="submit" whileTap={{ scale: 1.1 }}>
            추가
          </AddBtn>
        </AddForm>
        {loading ? (
          <div>로딩 중...</div>
        ) : (
          <List>
            {plans.map((p, i) => (
              <Item
                key={p._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: "1.3em" }}>
                    {p.type === "trip"
                      ? "✈️"
                      : p.type === "anniversary"
                      ? "🎂"
                      : p.type === "date"
                      ? "💑"
                      : "📝"}
                  </span>
                  <span style={{ fontWeight: 600 }}>{p.title}</span>
                  {p.place && <Place>@{p.place}</Place>}
                  {p.done && <DoneBadge>완료!</DoneBadge>}
                </div>
                <DateText>
                  {formatDate(p.startDate)}
                  {p.endDate && ` ~ ${formatDate(p.endDate)}`}
                </DateText>
                {p.description && (
                  <div style={{ color: "#888", fontSize: "0.97em" }}>
                    {p.description}
                  </div>
                )}
              </Item>
            ))}
          </List>
        )}
        <MenuGuide>하단 메뉴에서 다른 추억도 확인해보세요!</MenuGuide>
      </Container>
    </>
  );
}
