import { Routes, Route, NavLink, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useState, useEffect } from "react";
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

function getOnboarding() {
  // coupleId, inviteCode, onboardingStep 등 localStorage에서 가져오기
  try {
    const onboarding = JSON.parse(localStorage.getItem("onboarding"));
    return onboarding || {};
  } catch {
    return {};
  }
}

function setOnboarding(data) {
  localStorage.setItem("onboarding", JSON.stringify(data));
}

function App() {
  const navigate = useNavigate();
  const [onboarding, setOnboardingState] = useState(getOnboarding());
  const [user, setUser] = useState(null); // 로그인된 유저 정보

  // 온보딩 상태 동기화
  useEffect(() => {
    setOnboardingState(getOnboarding());
  }, []);

  // InvitePage에서 초대코드 입력/생성 완료 시
  function handleInviteSuccess({ mode, inviteCode }) {
    setOnboarding({ mode, inviteCode, step: "register" });
    setOnboardingState({ mode, inviteCode, step: "register" });
    navigate("/register");
  }

  // Register에서 회원가입 성공 시
  function handleRegisterSuccess() {
    setOnboarding({ ...onboarding, step: "login" });
    setOnboardingState((prev) => ({ ...prev, step: "login" }));
    navigate("/login");
  }

  // Login에서 로그인 성공 시
  function handleLoginSuccess(userObj) {
    setUser(userObj);
    // 로그인 시 coupleId가 있으면 온보딩 완료
    if (onboarding.coupleId) {
      setOnboarding({ ...onboarding, step: "done" });
      setOnboardingState((prev) => ({ ...prev, step: "done" }));
      navigate("/");
    }
  }

  // 로그아웃
  function handleLogout() {
    setUser(null);
    setOnboarding({});
    setOnboardingState({});
    navigate("/");
  }

  // 온보딩 플로우 분기
  if (!onboarding.coupleId) {
    // 1. 커플방 연결(초대코드 입력/생성)만 노출
    return <InvitePage onSuccess={handleInviteSuccess} />;
  }
  if (onboarding.step === "register") {
    // 2. 회원가입만 노출 (커플방 정보 props로 전달)
    return (
      <Register
        mode={onboarding.mode}
        inviteCode={onboarding.inviteCode}
        onRegister={handleRegisterSuccess}
      />
    );
  }
  if (onboarding.step === "login") {
    // 3. 로그인만 노출
    return (
      <Login coupleId={onboarding.coupleId} onLogin={handleLoginSuccess} />
    );
  }
  if (!user) {
    // 4. 로그인 필요(예외)
    return (
      <Login coupleId={onboarding.coupleId} onLogin={handleLoginSuccess} />
    );
  }
  // 5. 온보딩 완료: 전체 서비스 노출
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
          onClick={handleLogout}
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

export default App;
