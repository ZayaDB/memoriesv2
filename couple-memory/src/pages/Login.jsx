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

const Login = ({ coupleId, onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        setMessage("로그인 성공! 환영합니다.");
        setEmail("");
        setPassword("");
        if (onLogin) onLogin({ ...data.user, token: data.token });
      } else {
        setError(data.message || "로그인에 실패했습니다.");
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
          <Sub>다시 오신 걸 환영해요!</Sub>
          <div style={{ fontSize: "2em", marginBottom: "1em" }}>💗</div>
          <h2
            style={{
              color: "#ff7eb9",
              fontWeight: 700,
              fontSize: "1.4em",
              marginBottom: "1.2em",
            }}
          >
            로그인
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
              autoComplete="current-password"
            />
            <Button type="submit" disabled={loading}>
              {loading ? "로그인 중..." : "로그인"}
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
            <span style={{ color: "#ffb3d1" }}>아직 회원이 아니신가요?</span>
            <Link
              to="/register"
              style={{
                color: "#ff7eb9",
                fontWeight: 700,
                textDecoration: "underline",
              }}
            >
              회원가입
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
      <Guide>하단 메뉴에서 다른 추억도 확인해보세요!</Guide>
    </>
  );
};

export default Login;
