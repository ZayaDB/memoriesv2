import styled from "styled-components";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const API_URL =
  "https://memories-production-1440.up.railway.app/api/bucketlist";

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
  max-width: 350px;
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
  align-items: center;
  justify-content: space-between;
  gap: 1em;
`;
const Check = styled.input`
  accent-color: #ff7eb9;
  width: 1.3em;
  height: 1.3em;
`;
const AddForm = styled.form`
  display: flex;
  gap: 0.5em;
  margin-bottom: 2em;
  width: 100%;
  max-width: 350px;
`;
const AddInput = styled.input`
  flex: 1;
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
const TitleText = styled.span`
  font-size: 1.1em;
  color: ${({ done }) => (done ? "#bbb" : "#333")};
  text-decoration: ${({ done }) => (done ? "line-through" : "none")};
  font-family: ${({ theme }) => theme.font.cute};
`;
const DoneBadge = styled.span`
  background: #ffe3ef;
  color: #ff7eb9;
  border-radius: 8px;
  padding: 0.2em 0.7em;
  font-size: 0.9em;
  margin-left: 0.5em;
`;

export default function BucketList() {
  const [items, setItems] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    const res = await fetch(API_URL);
    const data = await res.json();
    setItems(data);
    setLoading(false);
  };
  useEffect(() => {
    fetchItems();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: input }),
    });
    setInput("");
    fetchItems();
  };

  const handleCheck = async (id, done) => {
    await fetch(`${API_URL}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ done: !done }),
    });
    fetchItems();
  };

  return (
    <Container>
      <Title>🪄 버킷리스트</Title>
      <Guide>
        둘이 꼭 해보고 싶은 것들을 적어보세요!
        <br />
        완료하면 체크하고, 사진/후기도 남길 수 있어요.
      </Guide>
      <AddForm onSubmit={handleAdd}>
        <AddInput
          type="text"
          placeholder="예: 스카이다이빙, 노을 보며 걷기..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <AddBtn type="submit" whileTap={{ scale: 1.1 }}>
          추가
        </AddBtn>
      </AddForm>
      {loading ? (
        <div>로딩 중...</div>
      ) : (
        <List>
          {items.map((item, i) => (
            <Item
              key={item._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Check
                type="checkbox"
                checked={item.done}
                onChange={() => handleCheck(item._id, item.done)}
              />
              <TitleText done={item.done}>{item.title}</TitleText>
              {item.done && <DoneBadge>완료!</DoneBadge>}
              {/* 후기/사진 업로드 버튼(추후 구현) */}
            </Item>
          ))}
        </List>
      )}
    </Container>
  );
}
