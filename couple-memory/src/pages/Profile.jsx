import styled from "styled-components";

const Container = styled.div`
  min-height: 80vh;
  padding: 2em 1em 70px 1em;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
`;
const Title = styled.h2`
  font-family: ${({ theme }) => theme.font.cute};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 1em;
`;
const Info = styled.div`
  color: ${({ theme }) => theme.colors.primary};
  background: ${({ theme }) => theme.colors.secondary};
  border-radius: 12px;
  padding: 1.2em 1.5em;
  box-shadow: ${({ theme }) => theme.shadow};
  text-align: center;
  margin-bottom: 1em;
`;
export default function Profile() {
  return (
    <Container>
      <Title>ENKHJIN & ZAYA</Title>
      <Info>
        사귄 날: 2024년 6월 30일
        <br />
        <br />
        ENKHJIN 💖 ZAYA
        <br />
        <br />
        "우리의 모든 순간이 소중해!"
      </Info>
    </Container>
  );
}
