import styled from "styled-components";
import { useState, useEffect } from "react";

const API_URL = "https://memories-production-1440.up.railway.app/api/photos";

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
  margin-bottom: 2em;
`;
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1em;
  width: 100%;
  max-width: 350px;
  margin-bottom: 2em;
`;
const Input = styled.input`
  padding: 0.7em;
  border-radius: 10px;
  border: 1px solid #ffe3ef;
  font-size: 1em;
`;
const Button = styled.button`
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  font-weight: bold;
  border: none;
  border-radius: 10px;
  padding: 0.7em 1.2em;
  font-size: 1em;
  cursor: pointer;
  box-shadow: ${({ theme }) => theme.shadow};
  &:hover {
    background: #ffb3d1;
  }
`;
const PhotoList = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1em;
  width: 100%;
  max-width: 400px;
  @media (min-width: 600px) {
    grid-template-columns: repeat(3, 1fr);
    max-width: 600px;
  }
`;
const PhotoCard = styled.div`
  background: ${({ theme }) => theme.colors.secondary};
  border-radius: 12px;
  box-shadow: ${({ theme }) => theme.shadow};
  padding: 0.5em;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const Img = styled.img`
  width: 100%;
  aspect-ratio: 1/1;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 0.3em;
`;
const Caption = styled.div`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1em;
  margin-bottom: 0.3em;
`;
const DateText = styled.div`
  color: #aaa;
  font-size: 0.9em;
`;

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function Album() {
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // 사진 목록 불러오기
  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setPhotos(data))
      .catch(() => setError("사진 목록을 불러오지 못했어요."));
  }, [success]);

  // 업로드 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!file) {
      setError("사진 파일을 선택해 주세요!");
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("photo", file);
    formData.append("caption", caption);
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("업로드 실패");
      setSuccess("사진이 업로드됐어요!");
      setFile(null);
      setCaption("");
    } catch (err) {
      setError("업로드에 실패했어요. 다시 시도해 주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Title>추억 앨범</Title>
      <Guide>
        사진과 글을 올려서
        <br />
        우리만의 추억을 남겨보자!
      </Guide>
      <Form onSubmit={handleSubmit}>
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <Input
          type="text"
          placeholder="사진 설명(캡션)"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
        <Button type="submit" disabled={loading}>
          {loading ? "업로드 중..." : "사진 업로드"}
        </Button>
        {error && (
          <Guide style={{ background: "#ffe3ef", color: "#ff7eb9" }}>
            {error}
          </Guide>
        )}
        {success && (
          <Guide style={{ background: "#b2f7ef", color: "#009688" }}>
            {success}
          </Guide>
        )}
      </Form>
      <PhotoList>
        {photos.map((p) => (
          <PhotoCard key={p._id}>
            <Img src={p.url} alt={p.caption} />
            <Caption>{p.caption}</Caption>
            <DateText>{formatDate(p.createdAt)}</DateText>
          </PhotoCard>
        ))}
      </PhotoList>
    </Container>
  );
}
