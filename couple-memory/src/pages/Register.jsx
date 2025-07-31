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
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [createdCode, setCreatedCode] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    try {
      // 1. 회원가입
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Бүртгүүлэхэд алдаа гарлаа.");
        setLoading(false);
        return;
      }

      // 2. 회원가입 성공 후 커플방 생성/입장
      const userId = data.user._id;
      if (!userId) {
        setError(
          "Бүртгүүлсний дараа хэрэглэгчийн ID олдсонгүй. Админтай холбогдоно уу."
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
            "Хосуудын өрөө үүсгэгдлээ! Доорх урилгын кодыг хамтрагчдад дамжуулна уу."
          );
          if (onRegister) onRegister(cData);
        } else {
          setError(cData.message || "Хосуудын өрөө үүсгэхэд алдаа гарлаа.");
        }
      } else {
        // 커플방 입장
        const jRes = await fetch(`${API_BASE}/api/couple/join`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, inviteCode }),
        });
        const jData = await jRes.json();
        if (jRes.ok) {
          setMessage("Хосуудын өрөөнд амжилттай орлоо!");
          if (onRegister) onRegister(jData.couple);
        } else {
          setError(jData.message || "Хосуудын өрөөнд ороход алдаа гарлаа.");
        }
      }
    } catch (err) {
      setError("Серверийн алдаа гарлаа.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(createdCode);
    setMessage("Урилгын код хуулагдлаа!");
  };

  return (
    <>
      <BG />
      <Center>
        <Card>
          <span style={{ fontSize: "2.5em", marginBottom: "0.2em" }}>
            🐻‍❄️💖🐰
          </span>
          <Title>Хосуудын дурсамжийн апп</Title>
          <Sub>Тавтай морил!</Sub>
          <div style={{ fontSize: "2em", marginBottom: "1em" }}>💗</div>
          <h2
            style={{
              color: "#ff7eb9",
              fontWeight: 700,
              fontSize: "1.4em",
              marginBottom: "1.2em",
            }}
          >
            {mode === "create"
              ? "Хосуудын өрөө үүсгэх"
              : "Хосуудын өрөөнд нэгдэх"}
          </h2>

          {createdCode && (
            <div
              style={{
                background: "#f8f9fa",
                padding: "1.5em",
                borderRadius: "12px",
                marginBottom: "1.5em",
                textAlign: "center",
                border: "2px solid #ffe3ef",
              }}
            >
              <div style={{ marginBottom: "1em", color: "#666" }}>
                Миний урилгын код: <b>{createdCode}</b>
              </div>
              <Button
                onClick={copyToClipboard}
                style={{ fontSize: "0.9em", padding: "0.7em 1.5em" }}
              >
                Хуулах
              </Button>
            </div>
          )}

          {mode === "join" && (
            <div
              style={{
                background: "#f8f9fa",
                padding: "1.5em",
                borderRadius: "12px",
                marginBottom: "1.5em",
                textAlign: "center",
                border: "2px solid #ffe3ef",
              }}
            >
              <div style={{ color: "#666" }}>
                Урилгын код: <b>{inviteCode}</b>
              </div>
            </div>
          )}

          <Form onSubmit={handleSubmit}>
            <Input
              type="text"
              placeholder="Нэрээ оруулна уу"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              type="email"
              placeholder="И-мэйл хаягаа оруулна уу"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Нууц үгийг оруулна уу"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Нууц үгийг дахин оруулна уу"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            {password !== confirmPassword && confirmPassword && (
              <div style={{ color: "#ff4d4f", fontSize: "0.9em" }}>
                Нууц үгнүүд таарахгүй байна
              </div>
            )}
            <Button
              type="submit"
              disabled={loading || password !== confirmPassword}
            >
              {loading ? "Бүртгэж байна..." : "Бүртгүүлэх"}
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
            <span style={{ color: "#ffb3d1" }}>Одоогоор гишүүн үү?</span>
            <Link
              to="/login"
              style={{
                color: "#ff7eb9",
                fontWeight: 700,
                textDecoration: "underline",
              }}
            >
              Нэвтрэх
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
      <Guide>Доод цэснээс бусад дурсамжуудыг харна уу!</Guide>
    </>
  );
};

export default Register;
