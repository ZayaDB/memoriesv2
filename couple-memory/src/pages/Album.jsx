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
export default function Album() {
  return (
    <Container>
      <Title>추억 앨범</Title>
      <Guide>
        사진과 글을 올려서
        <br />
        우리만의 추억을 남겨보자!
        <br />
        (업로드 기능은 곧 추가될 예정이야)
      </Guide>
    </Container>
  );
}
