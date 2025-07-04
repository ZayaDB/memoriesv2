import { Routes, Route, NavLink } from "react-router-dom";
import styled from "styled-components";
import { useState } from "react";
import Home from "./pages/Home";
import Album from "./pages/Album";
import Planner from "./pages/Planner";
import BucketList from "./pages/BucketList";
import Register from "./pages/Register";
import Login from "./pages/Login";
import InvitePage from "./pages/InvitePage";

const Nav = styled.nav`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100vw;
  background: #fff8fc;
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 60px;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  z-index: 100;
  @media (min-width: 600px) {
    width: 400px;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 20px 20px 0 0;
  }
`;
const NavItem = styled(NavLink)`
  color: #ff7eb9;
  font-size: 1.2rem;
  text-decoration: none;
  padding: 0.5em 1em;
  &.active {
    color: #fff;
    background: #ff7eb9;
    border-radius: 16px;
  }
`;

function App() {
  const [onboarding, setOnboarding] = useState({ step: "invite" });
  const [user, setUser] = useState(null);

  // InvitePage에서 초대코드 입력/생성 완료 시
  function handleInviteSuccess({ mode, inviteCode }) {
    setOnboarding({ mode, inviteCode, step: "register" });
  }

  // Register에서 회원가입 성공 시
  function handleRegisterSuccess() {
    setOnboarding((prev) => ({ ...prev, step: "login" }));
  }

  // Login에서 로그인 성공 시
  function handleLoginSuccess(userObj) {
    setUser(userObj);
    setOnboarding({ step: "done" });
  }

  // 온보딩 플로우 분기
  if (onboarding.step === "invite") {
    return <InvitePage onSuccess={handleInviteSuccess} />;
  }
  if (onboarding.step === "register") {
    return (
      <Register
        mode={onboarding.mode}
        inviteCode={onboarding.inviteCode}
        onRegister={handleRegisterSuccess}
      />
    );
  }
  if (onboarding.step === "login") {
    return <Login onLogin={handleLoginSuccess} />;
  }
  if (onboarding.step === "done" && user) {
    // 전체 서비스 노출
    return (
      <>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/album" element={<Album />} />
          <Route path="/planner" element={<Planner />} />
          <Route path="/bucketlist" element={<BucketList />} />
        </Routes>
        <Nav>
          <NavItem to="/">홈</NavItem>
          <NavItem to="/album">앨범</NavItem>
          <NavItem to="/planner">플래너</NavItem>
          <NavItem to="/bucketlist">버킷리스트</NavItem>
          <NavItem
            as="button"
            onClick={() => {
              setUser(null);
              setOnboarding({ step: "invite" });
            }}
            style={{
              background: "none",
              border: "none",
              color: "#ff7eb9",
              cursor: "pointer",
            }}
          >
            로그아웃
          </NavItem>
        </Nav>
      </>
    );
  }
  return null;
}

export default App;
