import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

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

export default function Settings({ coupleId, onSave }) {
  const [form, setForm] = useState({
    name: "",
    startDate: "",
    anniversary: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Settings coupleId:", coupleId);
    if (!coupleId) return;
    fetch(`${API_BASE}/api/couple/${coupleId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.couple) {
          setForm({
            name: data.couple.name || "",
            startDate: data.couple.startDate
              ? data.couple.startDate.slice(0, 10)
              : "",
            anniversary: data.couple.anniversary
              ? data.couple.anniversary.slice(0, 10)
              : "",
          });
        }
      });
  }, [coupleId]);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");
    if (!coupleId) {
      setError("커플 정보가 올바르지 않습니다. 다시 로그인해 주세요.");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/api/couple/${coupleId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("커플 정보가 저장되었습니다!");
        if (onSave) setTimeout(onSave, 800);
      } else {
        setError(data.message || "저장에 실패했습니다.");
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
          <Title>커플 정보 설정</Title>
          <Form onSubmit={handleSubmit}>
            <Input
              type="text"
              name="name"
              placeholder="커플 이름 (예: ZAYA & ENKHJIN)"
              value={form.name}
              onChange={handleChange}
              required
            />
            <label
              style={{
                color: "#ff7eb9",
                fontWeight: 500,
                marginBottom: 4,
                marginTop: 8,
                fontSize: "1em",
              }}
            >
              사귄 날짜
            </label>
            <Input
              type="date"
              name="startDate"
              placeholder="사귄 날짜 (필수)"
              value={form.startDate}
              onChange={handleChange}
              required
            />

            <Button type="submit" disabled={loading || !coupleId}>
              {loading ? "저장 중..." : "저장하기"}
            </Button>
          </Form>
          {message && (
            <div style={{ color: "#1db954", marginTop: 16 }}>{message}</div>
          )}
          {error && (
            <div style={{ color: "#ff4d4f", marginTop: 16 }}>{error}</div>
          )}
        </Card>
      </Center>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          marginTop: 32,
          position: "fixed",
          top: "80%",
          left: 0,
          right: 0,
          padding: "20px 0",
          backdropFilter: "blur(10px)",
        }}
      >
        <button
          onClick={() => {
            localStorage.removeItem("user");
            navigate(0); // 새로고침으로 온보딩 단계로 이동
          }}
          style={{
            background: "none",
            border: "none",
            color: "#ff4d4f",
            fontWeight: 700,
            fontSize: "1.1em",
            cursor: "pointer",
            textDecoration: "underline",
          }}
        >
          로그아웃
        </button>
      </div>
    </>
  );
}
