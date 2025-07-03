import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  :root {
    font-family: 'Gowun Dodum', 'Noto Sans KR', system-ui, Avenir, Helvetica, Arial, sans-serif;
    line-height: 1.5;
    font-weight: 400;
    color-scheme: light;
    color: #ff7eb9;
    background-color: #fff8fc;
    font-synthesis: none;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  html, body, #root {
    height: 100%;
    margin: 0;
    padding: 0;
    background: #fff8fc;
  }
  body {
    min-width: 320px;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
  }
  a {
    font-weight: 500;
    color: #ff7eb9;
    text-decoration: none;
    transition: color 0.2s;
  }
  a:hover {
    color: #ffb3d1;
  }
  button {
    border-radius: 12px;
    border: none;
    padding: 0.6em 1.2em;
    font-size: 1em;
    font-weight: 500;
    font-family: inherit;
    background-color: #ffe3ef;
    color: #ff7eb9;
    cursor: pointer;
    transition: background 0.2s;
    box-shadow: 0 2px 8px rgba(255,126,185,0.08);
  }
  button:hover {
    background-color: #ffb3d1;
    color: #fff;
  }
  * {
    box-sizing: border-box;
  }
`;

export default GlobalStyle;
