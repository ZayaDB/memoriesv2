import styled from "styled-components";
import { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { motion, AnimatePresence } from "framer-motion";
import "swiper/css";
import imageCompression from "browser-image-compression";

const API_URL = "https://memories-production-1440.up.railway.app/api/photos";
const COMMENT_URL =
  "https://memories-production-1440.up.railway.app/api/comments";

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

const PhotoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5em;
  width: 100%;
  max-width: 350px;
`;

const Img = styled.img`
  width: 100%;
  aspect-ratio: 1/1;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 0.3em;
  user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
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
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;
const ModalContent = styled.div`
  background: #fff8fc;
  border-radius: 16px;
  padding: 1em;
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const ModalImg = styled.img`
  max-width: 80vw;
  max-height: 60vh;
  border-radius: 12px;
  user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
`;
const CloseBtn = styled.button`
  background: #ff7eb9;
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  font-size: 1.5em;
  position: absolute;
  top: 20px;
  right: 20px;
  cursor: pointer;
`;

// 다운로드 다이얼로그 스타일
const DownloadDialog = styled(motion.div)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  border-radius: 20px;
  padding: 2em;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  z-index: 10000;
  text-align: center;
  max-width: 300px;
  width: 90%;
`;

const DownloadButton = styled.button`
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 12px;
  padding: 1em 2em;
  font-size: 1rem;
  cursor: pointer;
  margin: 0.5em;
  font-family: ${({ theme }) => theme.font.cute};

  &:hover {
    background: #ffb3d1;
  }
`;

const CancelButton = styled.button`
  background: #ccc;
  color: white;
  border: none;
  border-radius: 12px;
  padding: 1em 2em;
  font-size: 1rem;
  cursor: pointer;
  margin: 0.5em;
  font-family: ${({ theme }) => theme.font.cute};
`;

const CommentBox = styled.div`
  width: 100%;
  margin-top: 1em;
  background: #f7f7fa;
  border-radius: 10px;
  padding: 0.7em 1em;
`;
const CommentList = styled.div`
  margin-bottom: 0.5em;
`;
const CommentItem = styled.div`
  font-size: 0.97em;
  color: #555;
  margin-bottom: 0.3em;
`;
const CommentForm = styled.form`
  display: flex;
  gap: 0.5em;
  margin-top: 0.5em;
`;
const CommentInput = styled.input`
  flex: 1;
  border-radius: 8px;
  border: 1px solid #ffe3ef;
  padding: 0.4em 0.7em;
  font-size: 1em;
`;
const CommentBtn = styled.button`
  background: #ff7eb9;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0.4em 1em;
  font-size: 1em;
  cursor: pointer;
`;
const AnimatedPhotoCard = styled(motion.div)`
  background: ${({ theme }) => theme.colors.secondary};
  border-radius: 12px;
  box-shadow: ${({ theme }) => theme.shadow};
  padding: 0.5em;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 0.5em;
`;
const CuteButton = styled(motion.button)`
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  font-weight: bold;
  border: none;
  border-radius: 10px;
  padding: 0.7em 1.2em;
  font-size: 1em;
  cursor: pointer;
  box-shadow: ${({ theme }) => theme.shadow};
  margin-top: 0.5em;
  &:hover {
    background: #ffb3d1;
  }
`;
const Heart = styled(motion.div)`
  position: fixed;
  font-size: 2.2em;
  pointer-events: none;
  z-index: 99999;
`;
const TopIcon = styled.div`
  font-size: 2.2em;
  margin-bottom: 0.2em;
`;
const MenuGuide = styled.div`
  margin-top: 2em;
  color: #aaa;
  font-size: 1em;
  text-align: center;
  opacity: 0.8;
`;

const COMMENT_ICONS = [
  "🐻",
  "🐰",
  "🐱",
  "🐥",
  "💬",
  "🦊",
  "🐧",
  "🦄",
  "🦋",
  "🌸",
];

function getRandomIcon(idx) {
  return COMMENT_ICONS[idx % COMMENT_ICONS.length];
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function useComments(postId) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const fetchComments = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${COMMENT_URL}?postId=${postId}`);
      const data = await res.json();
      setComments(data);
    } catch {
      setComments([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (postId) fetchComments();
  }, [postId]);
  return { comments, loading, fetchComments };
}

function CommentSection({ postId }) {
  const { comments, loading, fetchComments } = useComments(postId);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setSending(true);
    await fetch(COMMENT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId, content: input }),
    });
    setInput("");
    setSending(false);
    fetchComments();
  };
  return (
    <CommentBox>
      <CommentList>
        {loading ? (
          "댓글 불러오는 중..."
        ) : comments.length === 0 ? (
          <span style={{ color: "#bbb" }}>아직 댓글이 없어요</span>
        ) : (
          comments.map((c, i) => (
            <CommentItem key={c._id}>
              <span style={{ fontSize: "1.1em", marginRight: 6 }}>
                {getRandomIcon(i)}
              </span>
              {c.content}
            </CommentItem>
          ))
        )}
      </CommentList>
      <CommentForm onSubmit={handleSubmit}>
        <CommentInput
          type="text"
          placeholder="댓글 달기..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={sending}
        />
        <CommentBtn type="submit" disabled={sending || !input.trim()}>
          등록
        </CommentBtn>
      </CommentForm>
    </CommentBox>
  );
}

const getThumbnailUrl = (url) => {
  if (!url) return url;
  // Cloudinary URL에서 '/upload/' 뒤에 썸네일 파라미터 삽입
  return url.replace("/upload/", "/upload/w_400,h_400,c_fill/");
};

export default function Album() {
  const [files, setFiles] = useState([]);
  const [caption, setCaption] = useState("");
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [modal, setModal] = useState({ open: false, photoIdx: 0, imgIdx: 0 });
  const [hearts, setHearts] = useState([]);
  const [editIdx, setEditIdx] = useState(-1);
  const [editCaption, setEditCaption] = useState("");

  // 다운로드 관련 상태
  const [downloadDialog, setDownloadDialog] = useState({
    show: false,
    imageUrl: "",
    imageName: "",
  });
  const longPressTimer = useRef(null);

  // 로그인한 유저의 coupleId 추출
  const coupleId = (() => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      return user?.coupleId;
    } catch {
      return null;
    }
  })();

  useEffect(() => {
    if (!coupleId) return;
    fetch(`${API_URL}?coupleId=${coupleId}`)
      .then((res) => res.json())
      .then((data) => setPhotos(data))
      .catch(() => setError("사진 목록을 불러오지 못했어요."));
  }, [loading, coupleId]);

  useEffect(() => {
    const timer = setInterval(() => popHeart(), 2200);
    return () => clearInterval(timer);
  }, []);

  const popHeart = () => {
    const id = Math.random().toString(36).slice(2);
    const x = Math.random() * 80 + 10;
    const y = Math.random() * 60 + 20;
    setHearts((prev) => [...prev, { id, x, y }]);
    setTimeout(() => setHearts((prev) => prev.filter((h) => h.id !== id)), 900);
  };

  // 이미지 다운로드 함수
  const downloadImage = async (imageUrl, imageName) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();

      // 다운로드 링크 생성
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = imageName || "couple-memory.jpg";

      // 다운로드 실행
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // 메모리 정리
      window.URL.revokeObjectURL(url);

      alert("이미지가 저장되었습니다! 📱");
    } catch (error) {
      console.error("다운로드 실패:", error);
      alert("다운로드에 실패했습니다. 다시 시도해주세요.");
    }
  };

  // 길게 누르기 시작
  const handleTouchStart = (imageUrl, imageName) => {
    longPressTimer.current = setTimeout(() => {
      setDownloadDialog({ show: true, imageUrl, imageName });
    }, 500); // 0.5초 길게 누르기
  };

  // 길게 누르기 취소
  const handleTouchEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  // 길게 누르기 취소 (터치 이동)
  const handleTouchMove = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!files.length) {
      setError("사진 파일을 선택해 주세요!");
      return;
    }
    setLoading(true);
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      // 이미지 리사이즈/압축 적용
      const compressedFile = await imageCompression(files[i], {
        maxWidthOrHeight: 1024,
        maxSizeMB: 0.5,
        useWebWorker: true,
      });
      formData.append("photos", compressedFile);
    }
    formData.append("caption", caption);
    formData.append("coupleId", coupleId);
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("업로드 실패");
      alert("사진이 업로드됐어요!");
      setFiles([]);
      setCaption("");
      popHeart();
    } catch (err) {
      setError("업로드에 실패했어요. 다시 시도해 주세요.");
    } finally {
      setLoading(false);
    }
  };

  const openModal = (photoIdx, imgIdx) => {
    setModal({ open: true, photoIdx, imgIdx });
  };

  const closeModal = () => setModal({ ...modal, open: false });

  return (
    <>
      <BG />
      <Container>
        <AnimatePresence>
          {hearts.map((h) => (
            <Heart
              key={h.id}
              initial={{ scale: 0, opacity: 1, x: `${h.x}vw`, y: `${h.y}vh` }}
              animate={{ scale: 1.2, opacity: 0.7, y: `${h.y - 10}vh` }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 1.2 }}
              style={{ left: 0, top: 0 }}
            >
              {Math.random() > 0.5 ? "💖" : "✨"}
            </Heart>
          ))}
        </AnimatePresence>
        <TopIcon>📸</TopIcon>
        <Title>추억 앨범</Title>
        <Guide>우리 추억을 남겨보자! 📱 길게 누르면 저장할 수 있어요!</Guide>
        <Form onSubmit={handleSubmit}>
          <Input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setFiles(Array.from(e.target.files))}
          />
          <Input
            type="text"
            placeholder="사진 설명(캡션)"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />
          <CuteButton
            type="submit"
            disabled={loading}
            whileTap={{ scale: 1.1, rotate: -5 }}
          >
            {loading ? "업로드 중..." : "사진 업로드 💖"}
          </CuteButton>
          {error && (
            <Guide style={{ background: "#ffe3ef", color: "#ff7eb9" }}>
              {error}
            </Guide>
          )}
        </Form>
        <PhotoList>
          {photos.map((p, photoIdx) => (
            <AnimatedPhotoCard
              key={p._id}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <Swiper
                spaceBetween={10}
                slidesPerView={1}
                style={{ width: "100%", borderRadius: "10px" }}
              >
                {p.urls.map((url, imgIdx) => (
                  <SwiperSlide key={imgIdx}>
                    <Img
                      src={getThumbnailUrl(url)}
                      alt={p.caption}
                      style={{ cursor: "pointer" }}
                      onClick={() => openModal(photoIdx, imgIdx)}
                      onTouchStart={() =>
                        handleTouchStart(
                          url,
                          `${p.caption || "couple-memory"}-${imgIdx + 1}.jpg`
                        )
                      }
                      onTouchEnd={handleTouchEnd}
                      onTouchMove={handleTouchMove}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
              {editIdx === photoIdx ? (
                <div style={{ width: "100%", margin: "0.5em 0" }}>
                  <Input
                    type="text"
                    value={editCaption}
                    onChange={(e) => setEditCaption(e.target.value)}
                    style={{ marginBottom: 8 }}
                  />
                  <div style={{ display: "flex", gap: 8 }}>
                    <CuteButton
                      type="button"
                      onClick={async () => {
                        if (!editCaption.trim()) return;
                        await fetch(API_URL + "/" + p._id, {
                          method: "PATCH",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            caption: editCaption,
                            coupleId,
                          }),
                        });
                        setEditIdx(-1);
                        setEditCaption("");
                        setLoading((l) => !l);
                      }}
                      whileTap={{ scale: 1.1 }}
                    >
                      저장
                    </CuteButton>
                    <CuteButton
                      type="button"
                      style={{ background: "#bbb" }}
                      onClick={() => {
                        setEditIdx(-1);
                        setEditCaption("");
                      }}
                      whileTap={{ scale: 1.1 }}
                    >
                      취소
                    </CuteButton>
                  </div>
                </div>
              ) : (
                <>
                  <Caption>{p.caption}</Caption>
                  <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                    <CuteButton
                      type="button"
                      style={{ background: "#ffb3d1", color: "#fff" }}
                      onClick={() => {
                        setEditIdx(photoIdx);
                        setEditCaption(p.caption || "");
                      }}
                      whileTap={{ scale: 1.1 }}
                    >
                      수정
                    </CuteButton>
                    <CuteButton
                      type="button"
                      style={{ background: "#bbb" }}
                      onClick={async () => {
                        if (!window.confirm("정말 삭제할까요?")) return;
                        await fetch(API_URL + "/" + p._id, {
                          method: "DELETE",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ coupleId }),
                        });
                        setLoading((l) => !l);
                      }}
                      whileTap={{ scale: 1.1 }}
                    >
                      삭제
                    </CuteButton>
                  </div>
                </>
              )}
              <DateText>{formatDate(p.createdAt)}</DateText>
              <CommentSection postId={p._id} />
            </AnimatedPhotoCard>
          ))}
        </PhotoList>
        {modal.open && (
          <ModalOverlay onClick={closeModal}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
              <CloseBtn onClick={closeModal}>&times;</CloseBtn>
              <Swiper
                initialSlide={modal.imgIdx}
                spaceBetween={10}
                slidesPerView={1}
                style={{ width: "70vw", maxWidth: 500, borderRadius: "12px" }}
              >
                {photos[modal.photoIdx].urls.map((url, idx) => (
                  <SwiperSlide key={idx}>
                    <ModalImg
                      src={url}
                      alt="modal"
                      onTouchStart={() =>
                        handleTouchStart(
                          url,
                          `${
                            photos[modal.photoIdx].caption || "couple-memory"
                          }-${idx + 1}.jpg`
                        )
                      }
                      onTouchEnd={handleTouchEnd}
                      onTouchMove={handleTouchMove}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
              <Caption style={{ marginTop: 16 }}>
                {photos[modal.photoIdx].caption}
              </Caption>
              <DateText>
                {formatDate(photos[modal.photoIdx].createdAt)}
              </DateText>
              <CommentSection postId={photos[modal.photoIdx]._id} />
            </ModalContent>
          </ModalOverlay>
        )}

        {/* 다운로드 다이얼로그 */}
        <AnimatePresence>
          {downloadDialog.show && (
            <ModalOverlay>
              <DownloadDialog
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
              >
                <h3 style={{ marginBottom: "1em", color: "#ff7eb9" }}>
                  💾 이미지 저장
                </h3>
                <p style={{ marginBottom: "1.5em", color: "#666" }}>
                  이 이미지를 저장하시겠어요?
                </p>
                <div
                  style={{
                    display: "flex",
                    gap: "1em",
                    justifyContent: "center",
                  }}
                >
                  <DownloadButton
                    onClick={() => {
                      downloadImage(
                        downloadDialog.imageUrl,
                        downloadDialog.imageName
                      );
                      setDownloadDialog({
                        show: false,
                        imageUrl: "",
                        imageName: "",
                      });
                    }}
                  >
                    💾 저장하기
                  </DownloadButton>
                  <CancelButton
                    onClick={() =>
                      setDownloadDialog({
                        show: false,
                        imageUrl: "",
                        imageName: "",
                      })
                    }
                  >
                    취소
                  </CancelButton>
                </div>
              </DownloadDialog>
            </ModalOverlay>
          )}
        </AnimatePresence>
      </Container>
    </>
  );
}
