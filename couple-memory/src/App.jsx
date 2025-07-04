import { Routes, Route, NavLink } from "react-router-dom";
import styled from "styled-components";
import Home from "./pages/Home";
import Album from "./pages/Album";
import Planner from "./pages/Planner";
import BucketList from "./pages/BucketList";
import Register from "./pages/Register";
import Login from "./pages/Login";

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
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/album" element={<Album />} />
        <Route path="/planner" element={<Planner />} />
        <Route path="/bucketlist" element={<BucketList />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      <Nav>
        <NavItem to="/">홈</NavItem>
        <NavItem to="/album">앨범</NavItem>
        <NavItem to="/planner">플래너</NavItem>
        <NavItem to="/bucketlist">버킷리스트</NavItem>
        <NavItem to="/login">로그인</NavItem>
        <NavItem to="/register">회원가입</NavItem>
      </Nav>
    </>
  );
}

export default App;
