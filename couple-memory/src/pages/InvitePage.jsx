import React, { useState } from "react";
import styled from "styled-components";

const API_BASE = "https://memories-production-1440.up.railway.app";

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
const Center = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const Card = styled.div`
  width: 100%;
  max-width: 400px;
  padding: 2.5em 2em 2em 2em;
  background: rgba(255, 255, 255, 0.92);
  border-radius: 24px;
  box-shadow: 0 4px 32px 0 #ffe3ef44;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const Title = styled.h1`
  font-family: ${({ theme }) => theme.font.cute || "inherit"};
  color: #ff7eb9;
  font-size: 2.1em;
  font-weight: bold;
  margin-bottom: 0.5em;
`;
const Sub = styled.div`
  color: #ffb3d1;
  font-size: 1.1em;
  margin-bottom: 1.5em;
`;
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.3em;
  width: 100%;
  margin-bottom: 1.2em;
`;
const Input = styled.input`
  width: 100%;
  padding: 1em;
  border-radius: 12px;
  border: 1.5px solid #ffe3ef;
  font-size: 1.08em;
  background: #fff;
  color: #444;
  margin-bottom: 0.2em;
  transition: box-shadow 0.2s, border 0.2s;
  &::placeholder {
    color: #bdbdbd;
    opacity: 1;
  }
  &:focus {
    outline: none;
    border: 1.5px solid #ffb3d1;
    box-shadow: 0 0 0 2px #ffe3ef88;
    background: #fff;
  }
`;
const Button = styled.button`
  width: 100%;
  padding: 1em 0;
  background: linear-gradient(90deg, #ffb3d1 0%, #ff7eb9 100%);
  color: #fff;
  font-weight: bold;
  font-size: 1.1em;
  border: none;
  border-radius: 14px;
  box-shadow: 0 2px 12px 0 #ffe3ef44;
  margin-top: 0.5em;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: linear-gradient(90deg, #ff7eb9 0%, #ffb3d1 100%);
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
const Guide = styled.div`
  color: #aaa;
  font-size: 1em;
  text-align: center;
  margin-top: 2em;
  opacity: 0.8;
`;

const OptionBtn = styled(Button)`
  margin-top: 1em;
  background: #ffe3ef;
  color: #ff7eb9;
  &:hover {
    background: #ffb3d1;
    color: #fff;
  }
`;

export default function InvitePage({ userId, onSuccess }) {
  const [mode, setMode] = useState(null); // "join" or "create"
  const [inviteCode, setInviteCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [createdCode, setCreatedCode] = useState("");

  const handleJoin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    setTimeout(() => {
      setLoading(false);
      if (onSuccess) onSuccess({ inviteCode });
    }, 500);
  };

  const handleCreate = async () => {
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const res = await fetch(`${API_BASE}/api/couple/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("새 커플방이 생성되었습니다!");
        setCreatedCode(data.inviteCode);
        if (onSuccess)
          onSuccess({ coupleId: data.coupleId, inviteCode: data.inviteCode });
      } else {
        setError(data.message || "생성에 실패했습니다.");
      }
    } catch (err) {
      setError("서버 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <BG />
      <Center>
        <Card>
          <span style={{ fontSize: "2.5em", marginBottom: "0.2em" }}>💌</span>
          <Title>커플방 연결</Title>
          <Sub>초대코드로 입장하거나, 새 커플방을 만들어보세요!</Sub>
          {!mode && (
            <>
              <OptionBtn onClick={() => setMode("join")}>
                초대코드로 입장
              </OptionBtn>
              <OptionBtn onClick={handleCreate}>새 커플방 만들기</OptionBtn>
            </>
          )}
          {mode === "join" && (
            <Form onSubmit={handleJoin}>
              <Input
                type="text"
                placeholder="초대코드를 입력하세요"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                required
                maxLength={8}
                autoFocus
              />
              <Button type="submit" disabled={loading}>
                {loading ? "입장 중..." : "입장하기"}
              </Button>
              <OptionBtn type="button" onClick={() => setMode(null)}>
                돌아가기
              </OptionBtn>
            </Form>
          )}
          {createdCode && (
            <div
              style={{ marginTop: 18, color: "#ff7eb9", textAlign: "center" }}
            >
              내 초대코드: <b>{createdCode}</b>
              <br />
              상대방에게 이 코드를 알려주세요!
            </div>
          )}
          {message && (
            <div
              style={{ marginTop: 18, color: "#1db954", textAlign: "center" }}
            >
              {message}
            </div>
          )}
          {error && (
            <div
              style={{ marginTop: 18, color: "#ff4d4f", textAlign: "center" }}
            >
              {error}
            </div>
          )}
        </Card>
      </Center>
      <Guide>커플방 연결 후 다양한 추억을 시작해보세요!</Guide>
    </>
  );
}
