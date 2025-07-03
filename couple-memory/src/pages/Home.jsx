import { motion } from "framer-motion";
import styled from "styled-components";

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
  font-size: 2.2rem;
  color: ${({ theme }) => theme.colors.primary};
  margin: 0.5em 0 0.2em 0;
  letter-spacing: 2px;
`;
const Dday = styled(motion.div)`
  font-size: 1.5rem;
  color: #fff;
  background: ${({ theme }) => theme.colors.primary};
  padding: 0.5em 1.5em;
  border-radius: 20px;
  margin-bottom: 1em;
  box-shadow: ${({ theme }) => theme.shadow};
`;
const TodayMsg = styled.div`
  font-size: 1.1rem;
  color: ${({ theme }) => theme.colors.primary};
  margin-top: 2em;
  text-align: center;
  background: ${({ theme }) => theme.colors.secondary};
  border-radius: 12px;
  padding: 1em 1.5em;
  box-shadow: ${({ theme }) => theme.shadow};
`;
function getDday() {
  const start = new Date("2024-06-30");
  const now = new Date();
  const diff = now - start;
  return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
}

export default function Home() {
  return (
    <Container>
      <Names
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
      >
        ENKHJIN & ZAYA
      </Names>
      <Dday
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
      >
        D+{getDday()}
      </Dday>
      <TodayMsg>
        오늘도 사랑해!
        <br />
        우리만의 추억을 쌓아가자 💖
      </TodayMsg>
    </Container>
  );
}
