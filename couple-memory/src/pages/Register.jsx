import React, { useState } from "react";
import { Link } from "react-router-dom";
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

const Register = ({ mode, inviteCode, onRegister }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [createdCode, setCreatedCode] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");
    setCreatedCode("");
    try {
      // 1. 회원가입
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, nickname }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "회원가입에 실패했습니다.");
        setLoading(false);
        return;
      }
      // 2. 회원가입 성공 후 커플방 생성/입장
      const userId =
        data.userId || data._id || data.id || (data.user && data.user._id);
      if (!userId) {
        setError(
          "회원가입 후 userId를 찾을 수 없습니다. 관리자에게 문의하세요."
        );
        setLoading(false);
        return;
      }
      if (mode === "create") {
        // 커플방 생성
        const cRes = await fetch(`${API_BASE}/api/couple/create`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        });
        const cData = await cRes.json();
        if (cRes.ok) {
          setCreatedCode(cData.inviteCode);
          setMessage(
            "커플방이 생성되었습니다! 아래 초대코드를 상대방에게 전달하세요."
          );
          if (onRegister) setTimeout(onRegister, 2000); // 2초 후 로그인 이동
        } else {
          setError(cData.message || "커플방 생성에 실패했습니다.");
        }
      } else if (mode === "join") {
        // 커플방 입장
        const jRes = await fetch(`${API_BASE}/api/couple/join`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, inviteCode }),
        });
        const jData = await jRes.json();
        if (jRes.ok) {
          setMessage("커플방에 입장했습니다! 로그인 해주세요.");
          if (onRegister) setTimeout(onRegister, 1500);
        } else {
          setError(jData.message || "커플방 입장에 실패했습니다.");
        }
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
          <span style={{ fontSize: "2.5em", marginBottom: "0.2em" }}>
            🐻‍❄️💖🐰
          </span>
          <Title>커플 추억앱</Title>
          <Sub>함께 시작해볼까요?</Sub>
          {mode === "create" && createdCode && (
            <div
              style={{ color: "#ff7eb9", marginBottom: 12, fontWeight: 500 }}
            >
              내 초대코드: <b>{createdCode}</b>
            </div>
          )}
          {mode === "join" && inviteCode && (
            <div
              style={{ color: "#ff7eb9", marginBottom: 12, fontWeight: 500 }}
            >
              초대코드: <b>{inviteCode}</b>
            </div>
          )}
          <div style={{ fontSize: "2em", marginBottom: "1em" }}>💗</div>
          <h2
            style={{
              color: "#ff7eb9",
              fontWeight: 700,
              fontSize: "1.4em",
              marginBottom: "1.2em",
            }}
          >
            회원가입
          </h2>
          <Form onSubmit={handleSubmit}>
            <Input
              type="email"
              placeholder="이메일을 입력하세요"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
            />
            <Input
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
            <Input
              type="text"
              placeholder="닉네임을 입력하세요"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              required
              autoComplete="nickname"
            />
            <Button type="submit" disabled={loading}>
              {loading ? "가입 중..." : "회원가입"}
            </Button>
          </Form>
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 8,
              marginTop: 24,
            }}
          >
            <span style={{ color: "#ffb3d1" }}>이미 회원이신가요?</span>
            <Link
              to="/login"
              style={{
                color: "#ff7eb9",
                fontWeight: 700,
                textDecoration: "underline",
              }}
            >
              로그인
            </Link>
          </div>
          {message && (
            <div
              style={{ marginTop: 24, color: "#1db954", textAlign: "center" }}
            >
              {message}
            </div>
          )}
          {error && (
            <div
              style={{ marginTop: 24, color: "#ff4d4f", textAlign: "center" }}
            >
              {error}
            </div>
          )}
        </Card>
      </Center>
      <Guide>하단 메뉴에서 다양한 추억을 만들어보세요!</Guide>
    </>
  );
};

export default Register;
