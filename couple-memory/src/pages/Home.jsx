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
  justify-content: center;
  min-height: 80vh;
  padding-bottom: 60px;
`;
const Names = styled(motion.h2)`
  font-family: ${({ theme }) => theme.font.cute};
  font-size: 2.3rem;
  color: ${({ theme }) => theme.colors.primary};
  margin: 0.7em 0 0.2em 0;
  letter-spacing: 2px;
  display: flex;
  align-items: center;
  gap: 0.5em;
`;
const Dday = styled(motion.div)`
  font-size: 1.6rem;
  color: #fff;
  background: linear-gradient(90deg, #ffb3d1 60%, #aeefff 100%);
  padding: 0.6em 1.7em;
  border-radius: 22px;
  margin-bottom: 1.2em;
  box-shadow: ${({ theme }) => theme.shadow};
  font-family: ${({ theme }) => theme.font.cute};
`;
const TodayMsg = styled(motion.div)`
  font-size: 1.15rem;
  color: ${({ theme }) => theme.colors.primary};
  margin-top: 2em;
  text-align: center;
  background: ${({ theme }) => theme.colors.secondary};
  border-radius: 14px;
  padding: 1.2em 1.7em;
  box-shadow: ${({ theme }) => theme.shadow};
  min-width: 220px;
`;
const Character = styled(motion.div)`
  font-size: 3.2em;
  margin-bottom: 0.2em;
`;
const MenuGuide = styled.div`
  margin-top: 2.5em;
  color: #aaa;
  font-size: 1em;
  text-align: center;
  opacity: 0.8;
`;
const Heart = styled(motion.div)`
  position: fixed;
  font-size: 2.2em;
  pointer-events: none;
  z-index: 99999;
`;
const SettingsIcon = styled.button`
  position: absolute;
  bottom: 60px;
  right: 0;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #ff7eb9;
  cursor: pointer;
  z-index: 10;
  transition: color 0.2s;
  &:hover {
    color: #ff4d4f;
  }
`;
const MSGS = [
  "오늘도 사랑해! 우리만의 추억을 쌓아가자 💖",
  "함께라서 행복해!",
  "오늘은 어떤 추억을 만들까?",
  "늘 고마워, 소중해!",
  "우리 오래오래 행복하자 🌸",
  "사랑해, 오늘도 내일도!",
  "너와 함께라면 어디든 좋아!",
  "웃음 가득한 하루 보내자 😊",
  "우리의 하루가 특별해지는 중!",
];
const API_BASE = "https://memories-production-1440.up.railway.app";

export default function Home({ user, coupleId }) {
  const [msg, setMsg] = useState(MSGS[0]);
  const [hearts, setHearts] = useState([]);
  const [couple, setCouple] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setMsg(MSGS[Math.floor(Math.random() * MSGS.length)]);
    const timer = setInterval(() => popHeart(), 1800);
    return () => clearInterval(timer);
  }, []);

  // 커플 정보 fetch (설정에서 수정하면 홈에도 반영)
  useEffect(() => {
    if (!coupleId) return;
    fetch(`${API_BASE}/api/couple/${coupleId}`)
      .then((res) => res.json())
      .then((data) => {
        setCouple(data.couple);
        console.log("커플 정보:", data.couple);
      });
  }, [coupleId]);

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

  // 커플 이름: 커플 정보의 name만 사용
  const coupleName = couple?.name || "";
  // 사귄 날짜: 커플 정보의 startDate
  const startDate = couple?.startDate;
  // D-day 계산
  function getDday() {
    if (!startDate) return "-";
    const start = new Date(startDate);
    const now = new Date();
    const diff = now - start;
    return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
  }

  return (
    <>
      <BG />
      <SettingsIcon onClick={() => navigate("/settings")} title="설정">
        <span role="img" aria-label="설정">
          ⚙️
        </span>
      </SettingsIcon>
      <Container>
        <AnimatePresence>
          {hearts.map((h) => (
            <Heart
              key={h.id}
              initial={{ scale: 0, opacity: 1, x: `${h.x}vw`, y: `${h.y}vh` }}
              animate={{ scale: 1.2, opacity: 0.7, y: `${h.y - 10}vh` }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 1.2 }}
              style={{ left: 0, top: 0 }}
            >
              {Math.random() > 0.5 ? "💖" : "✨"}
            </Heart>
          ))}
        </AnimatePresence>
        <Character
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
        >
          🐻‍❄️&nbsp;🐰
        </Character>
        <Names
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          {coupleName}
        </Names>
        <Dday
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          D+{getDday()}
        </Dday>
        <TodayMsg
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
        >
          {msg}
        </TodayMsg>
        <MenuGuide>📸 앨범 | 🪄 버킷리스트 | ✈️ 플래너</MenuGuide>
      </Container>
    </>
  );
}
