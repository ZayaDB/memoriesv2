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

export default function InvitePage({ onSuccess }) {
  const [mode, setMode] = useState(null); // "join" or "create"
  const [inviteCode, setInviteCode] = useState("");

  const handleNext = () => {
    if (mode === "join" && !inviteCode) return;
    if (onSuccess)
      onSuccess({ mode, inviteCode: inviteCode.trim().toUpperCase() });
  };

  return (
    <>
      <BG />
      <Center>
        <Card>
          <span style={{ fontSize: "2.5em", marginBottom: "0.2em" }}>💌</span>
          <Title>Хосуудын өрөө холбогдох</Title>
          <Sub>
            Урилгын кодыг ашиглан орж эсвэл шинэ хосуудын өрөө үүсгээрэй!
          </Sub>
          {!mode && (
            <>
              <OptionBtn onClick={() => setMode("join")}>
                Урилгын кодыг ашиглан орох
              </OptionBtn>
              <OptionBtn onClick={() => setMode("create")}>
                Шинэ хосуудын өрөө үүсгэх
              </OptionBtn>
            </>
          )}
          {mode === "join" && (
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                handleNext();
              }}
            >
              <Input
                type="text"
                placeholder="Урилгын кодыг оруулна уу"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                required
                maxLength={8}
                autoFocus
              />
              <Button type="submit">Дараах</Button>
              <OptionBtn type="button" onClick={() => setMode(null)}>
                Буцах
              </OptionBtn>
            </Form>
          )}
          {mode === "create" && (
            <>
              <Button style={{ marginTop: 24 }} onClick={handleNext}>
                Бүртгүүлэхэд очих
              </Button>
              <OptionBtn type="button" onClick={() => setMode(null)}>
                Буцах
              </OptionBtn>
            </>
          )}
        </Card>
      </Center>
      <Guide>
        Хосуудын өрөө холбогдсны дараа олон төрлийн дурсамж эхлүүлээрэй!
      </Guide>
    </>
  );
}
