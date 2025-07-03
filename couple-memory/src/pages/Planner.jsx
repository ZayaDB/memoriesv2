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
const Guide = styled.div`
  color: ${({ theme }) => theme.colors.primary};
  background: ${({ theme }) => theme.colors.secondary};
  border-radius: 12px;
  padding: 1.2em 1.5em;
  box-shadow: ${({ theme }) => theme.shadow};
  text-align: center;
`;
export default function Planner() {
  return (
    <Container>
      <Title>기념일 & 여행 플래너</Title>
      <Guide>
        우리만의 특별한 날과 여행을
        <br />
        함께 계획해보자!
        <br />
        (일정 추가 기능은 곧 추가될 예정이야)
      </Guide>
    </Container>
  );
}
