import { Routes, Route, NavLink } from "react-router-dom";
import styled from "styled-components";
import { useState, useEffect } from "react";
import Home from "./pages/Home";
import Album from "./pages/Album";
import Planner from "./pages/Planner";
import Finance from "./pages/Finance";
import Register from "./pages/Register";
import Login from "./pages/Login";
import InvitePage from "./pages/InvitePage";
import Settings from "./pages/Settings";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  // 앱 시작 시 localStorage에서 user 불러오기
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setOnboarding({ step: "done" });
    }
  }, []);

  // InvitePage에서 초대코드 입력/생성 완료 시
  function handleInviteSuccess({ mode, inviteCode }) {
    setOnboarding({ mode, inviteCode, step: "register" });
  }

  // Register에서 회원가입 성공 시
  function handleRegisterSuccess(registerData) {
    if (registerData && registerData.user) {
      // 회원가입 성공 시 바로 로그인 처리
      setUser(registerData.user);
      setOnboarding({ step: "done" });
      localStorage.setItem("user", JSON.stringify(registerData.user));
    } else {
      // 기존 방식: 로그인 페이지로 이동
      setOnboarding((prev) => ({ ...prev, step: "login" }));
    }
  }

  // Login에서 로그인 성공 시
  function handleLoginSuccess(userObj) {
    setUser(userObj);
    setOnboarding({ step: "done" });
    localStorage.setItem("user", JSON.stringify(userObj));
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
          <Route
            path="/"
            element={<Home user={user} coupleId={user.coupleId} />}
          />
          <Route path="/album" element={<Album />} />
          <Route path="/planner" element={<Planner />} />
          <Route
            path="/finance"
            element={<Finance user={user} coupleId={user.coupleId} />}
          />
          <Route
            path="/settings"
            element={<Settings coupleId={user.coupleId} onSave />}
          />
        </Routes>
        <Nav>
          <NavItem to="/">Home</NavItem>
          <NavItem to="/album">Album</NavItem>
          <NavItem to="/planner">Planner</NavItem>
          <NavItem to="/finance">Finance</NavItem>
        </Nav>
      </>
    );
  }
  return null;
}

export default App;
