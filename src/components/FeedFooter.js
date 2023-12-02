import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled, { ThemeProvider, keyframes } from "styled-components";
import { BASE_URL } from "./../config";
import axios from "axios";
import componentTheme from "./theme";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function FeedFooter(props) {
  // 테마
  const colorTheme = useSelector((state) => state.theme.themes[state.theme.currentTheme]);
  const filterTheme = useSelector((state) => state.theme.filters[state.theme.currentTheme]);
  const theme = {
    color: colorTheme,
    filter: filterTheme,
    component: componentTheme,
  };

  // 상태 관리
  const user = useSelector((state) => state.user);
  const feedInfo = props.feedInfo;

  ////////// 이모지 //////////
  
  // 상태 관리
  const [myReactions, setMyReactions] = useState([]); // 피드에 대한 자신의 이모지
  const [emojiInfoRaw, setEmojiInfoRaw] = useState({}); // 피드 이모지 정보
  const [emojiInfo, setEmojiInfo] = useState({}); //피드 최다 이모지 및 총 이모지 갯수 표시를 위한 변수
  const [isEmojiModalOpen, setIsEmojiModalOpen] = useState(false); // 이모지 모달
  const [modalTimerId, setModalTimerId] = useState(null); // 이모지 모달 타이머

  // 이모지 카운트 조회
  async function getEmojiCount(feedId, authToken) {
    try {
      const response = await axios.get(`${BASE_URL}/feed/emoji/${feedId}/`, {
        headers: {
          Authorization: `Token ${authToken}`,
        },
      });

      setEmojiInfoRaw(response.data.emoji_count);
      setMyReactions(response.data.user_reactions);
    } catch (error) {
      console.log("이모지 카운트 조회 중 오류 발생: ", error);
      alert("이모지 카운트 조회 중 오류가 발생했습니다");
    }
  }

  // 이모지 입력
  async function addEmoji(feedId, authToken, emojiName) {
    console.log("1");
    if (myReactions.length >= 5) {
      toast.warn("응원 이모티콘은 5개까지만 가능합니다", {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 2000,
        hideProgressBar: true,
        newestOnTop: true,
      });
      return;
    }

    try {
      const response = await axios.post(
        `${BASE_URL}/feed/emoji/add/`,
        { feed_id: feedId, emoji_name: emojiName },
        {
          headers: {
            Authorization: `Token ${authToken}`,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        let newEmojiInfo = { ...emojiInfoRaw };
        newEmojiInfo[emojiName] = (newEmojiInfo[emojiName] || 0) + 1;

        setEmojiInfoRaw(newEmojiInfo);
        setEmojiInfo(getEmojiInfo(newEmojiInfo));
        setMyReactions((previousReactions) => [...previousReactions, emojiName]);
      }
    } catch (error) {
      console.log("이모지 입력/수정 중 오류 발생: ", error);
      alert("이모지 입력/수정 중 오류가 발생했습니다.");
    }
  }

  // 이모지 취소
  async function removeEmoji(feedId, authToken, emojiName) {
    try {
      const response = await axios.delete(`${BASE_URL}/feed/emoji/remove/`, {
        data: { feed_id: feedId, emoji_name: emojiName },
        headers: { "Content-Type": "application/json", Authorization: `Token ${authToken}` },
      });

      if (response.status === 204) {
        let newEmojiInfo = { ...emojiInfoRaw };
        newEmojiInfo[emojiName] = Math.max(newEmojiInfo[emojiName] - 1, 0);

        setEmojiInfoRaw(newEmojiInfo);
        setEmojiInfo(getEmojiInfo(newEmojiInfo));
        setMyReactions((currentReactions) =>
          currentReactions.filter((reaction) => reaction !== emojiName)
        );
      }
    } catch (error) {
      console.log("이모지 취소 중 오류 발생: ", error);
      alert("이모지 취소 중 오류가 발생했습니다.");
    }
  }

  // 최초 마운트 -> 이모지 카운트 조회
  useEffect(() => {
    getEmojiCount(feedInfo.id, user.authToken);
  }, [feedInfo.id && user.authToken]);

  // 이모지 카운트 조회 -> 이모지 상태 업데이트
  useEffect(() => {
    setEmojiInfo(getEmojiInfo(emojiInfoRaw));
  }, [emojiInfoRaw]);

  // 가장 많은 이모지 5가지, 총 카운트 추출
  const getEmojiInfo = (emoji_count) => {
    let total_count = Object.values(emoji_count).reduce((acc, value) => acc + value, 0);

    let sortedEmojis = Object.entries(emoji_count)
      .sort((a, b) => b[1] - a[1])
      .filter(([key, value]) => value > 0)
      .slice(0, 5);

    let topEmojis = sortedEmojis.map(([key, value]) => ({ key, value }));

    return { total_count, topEmojis };
  };

  // EmojiModal open/close 함수
  const openEmojiModal = () => {
    if (modalTimerId) {
      clearTimeout(modalTimerId);
      setModalTimerId(null);
    }
    setIsEmojiModalOpen(true);
  };
  const closeEmojiModal = () => {
    setIsEmojiModalOpen(false);
  };

  //////// 댓글 //////////

  // 상태 관리
  const [isCommentOpen, setIsCommentOpen] = useState(false); // 댓글 컴포넌트 상태

  // 댓글 컴포넌트 toggle 함수
  const toggleCommentComponent = () => {
    setIsCommentOpen(!isCommentOpen);
  };

  return (
    <ThemeProvider theme={theme}>
      <ToastContainer />
      <FeedFooterContainer>
        <CommunicationBox>
          {/*////////// 이모지 //////////*/}
          {emojiInfo.total_count >= 1 ? (
            <IconBox
              onMouseEnter={() => {
                const timerId = setTimeout(() => {
                  openEmojiModal();
                }, 500);
                setModalTimerId(timerId);
              }}
              onMouseLeave={() => {
                const newModalTimerId = setTimeout(() => {
                  closeEmojiModal();
                }, 1000);
                setModalTimerId(newModalTimerId);
              }}
              myReactions={myReactions}
            >
              {emojiInfo.topEmojis.map((emoji) => (
                <EmojiIcon
                  key={emoji.key}
                  src={process.env.PUBLIC_URL + `/icon/reaction/${emoji.key}.svg`}
                />
              ))}
              <EmojiCommentText myReactions={myReactions}>{emojiInfo.total_count}</EmojiCommentText>
            </IconBox>
          ) : (
            <IconBox
            onMouseEnter={() => {
              const timerId = setTimeout(() => {
                openEmojiModal();
              }, 500);
              setModalTimerId(timerId);
            }}
            onMouseLeave={() => {
              const newModalTimerId = setTimeout(() => {
                closeEmojiModal();
              }, 1000);
              setModalTimerId(newModalTimerId);
            }}
            >
              <AddEmoji src={process.env.PUBLIC_URL + `/icon/addEmoji.svg`} />
              <EmojiCommentText>좋아요</EmojiCommentText>
            </IconBox>
          )}
          {/*////////// 댓글 //////////*/}
          {feedInfo.comment_info.length >= 1 ? (
            <CommentBox onClick={toggleCommentComponent}>
              <CommentFill src={process.env.PUBLIC_URL + `/icon/commentFill.svg`} />
              <EmojiCommentText>{feedInfo.comment_info.length}</EmojiCommentText>
            </CommentBox>
          ) : (
            <CommentBox onClick={toggleCommentComponent}>
              <AddComment src={process.env.PUBLIC_URL + `/icon/addComment.svg`} />
              <EmojiCommentText>댓글</EmojiCommentText>
            </CommentBox>
          )}
        </CommunicationBox>
        {isEmojiModalOpen && (
          <EmojiModal
            feedInfo={feedInfo}
            openEmojiModal={openEmojiModal}
            closeEmojiModal={closeEmojiModal}
            setModalTimerId={setModalTimerId}
            addEmoji={addEmoji}
            removeEmoji={removeEmoji}
            myReactions={myReactions}
          />
        )}
        {isCommentOpen && <CommentComponent feedInfo={feedInfo} />}
      </FeedFooterContainer>
    </ThemeProvider>
  );
}

function EmojiModal(props) {
  // 상태 관리
  const user = useSelector((state) => state.user);
  const [hoveredEmoji, setHoveredEmoji] = useState("");

  // 이모지 배열
  const emojis = [
    { name: "great", icon: "great", text: "훌륭해요" },
    { name: "support", icon: "support", text: "응원해요" },
    { name: "cool", icon: "cool", text: "멋있어요" },
    { name: "wow", icon: "wow", text: "와우" },
    { name: "astonishing", icon: "astonishing", text: "놀라워요" },
    { name: "fighting", icon: "fighting", text: "화이팅" },
    { name: "ant", icon: "ant", text: "개미" },
    { name: "one_hundred", icon: "one_hundred", text: "100점" },
    { name: "first", icon: "first", text: "1등" },
    { name: "trophy", icon: "trophy", text: "트로피" },
    { name: "jjang-1", icon: "jjang-1", text: "짱" },
    { name: "jjang-2", icon: "jjang-2", text: "짱" },
    { name: "jjang-3", icon: "jjang-3", text: "짱" },
    { name: "jjang-4", icon: "jjang-4", text: "짱" },
    { name: "jjang-5", icon: "jjang-5", text: "짱" },
  ];

  // 이모지 애니메이션 이벤트
  const handleEmojiMouseEnter = (emojiName) => {
    setHoveredEmoji(emojiName);
  };
  const handleEmojiMouseLeave = () => {
    setHoveredEmoji("");
  };

  // 이모지 클릭 이벤트
  const handleEmojiClick = (emojiName) => {
    if (props.myReactions.includes(emojiName)) {
      props.removeEmoji(props.feedInfo.id, user.authToken, emojiName);
    } else {
      props.addEmoji(props.feedInfo.id, user.authToken, emojiName);
    }
    // props.closeEmojiModal();
  };

  return (
    <EmojiContainer
      onMouseEnter={props.openEmojiModal}
      onMouseLeave={() => {
        const newModalTimerId = setTimeout(() => {
          props.closeEmojiModal();
        }, 1000);
        props.setModalTimerId(newModalTimerId);
      }}
    >
      {emojis.map((emoji) => (
        <EmojiWrapper
          key={emoji.name}
          onMouseEnter={() => handleEmojiMouseEnter(emoji.name)}
          onMouseLeave={handleEmojiMouseLeave}
        >
          <Emoji
            src={process.env.PUBLIC_URL + `/icon/reaction/${emoji.icon}.svg`}
            onClick={() => handleEmojiClick(emoji.name)}
            myReactions={props.myReactions}
            emojiName={emoji.name}
          ></Emoji>
          {hoveredEmoji === emoji.name && <EmojiText>{emoji.text}</EmojiText>}
        </EmojiWrapper>
      ))}
    </EmojiContainer>
  );
}

function CommentComponent (props) {
  // 상태 관리
  const user = useSelector((state) => state.user);
  const [commentInput, setCommentInput] = useState(""); // 댓글 입력 상태
  const [commentsInfo, setCommentsInfo] = useState([]); // 댓글 저장하기 위한 상태

  // 댓글 조회 요청
  async function getComments(feedId, authToken) {
    try {
      const response = await axios.get(`${BASE_URL}/feed/${feedId}/comment`, {
        headers: {
          Authorization: `Token ${authToken}`,
        },
      });
      console.log(response.data);
    } catch (error) {
      console.log("댓글 조회 중 오류 발생: ", error)
    }
  }

  // 댓글 조회 요청 시점
  useEffect(() => {
    getComments(props.feedInfo.id, user.authToken);
  }, [])

  // 댓글 입력 요청
  async function submitAddComment(e, feedId, authToken, commentInput) {
    if (e.key === 'Enter' && !e.shiftKey && commentInput) {
      e.preventDefault(); // Enter 키 기본 동작 방지
      try {
        const response = await axios.post(
          `${BASE_URL}/feed/${feedId}/comment/add/`, // URL 경로 수정
          { comment: commentInput }, // 데이터 전송 방식 수정
          {
            headers: {
              Authorization: `Token ${authToken}`,
            },
          }
        );
        // 성공적으로 댓글이 추가된 후의 로직 (예: 상태 업데이트, 사용자에게 알림 등)
      } catch (error) {
        console.log("댓글 작성 중 오류 발생 : ", error)
      }
    }
  }

  // 댓글 필드에 입력된 값
  const handleCommentInput = (e) => {
    // 입력 창 높이 조절
    e.target.style.height = 'inherit'; 
    e.target.style.height = `${e.target.scrollHeight}px`;

    // 댓글 입력 상태 업데이트
    setCommentInput(e.target.value);
  };


  return (
    <CommentLayout>
      <AddCommentArea>
        <CommentProfile src={process.env.PUBLIC_URL + "/testImg/profile2.jpg"}></CommentProfile>
        <CommentTextArea onInput={handleCommentInput} onKeyDown={(e) => submitAddComment(e, props.feedInfo.id, user.authToken, commentInput)} placeholder="댓글 남기기" rows="1"></CommentTextArea>
      </AddCommentArea>
      <CommentListArea>
        <CommentList>댓글 목록</CommentList>
        <CommentList>댓글 목록</CommentList>
      </CommentListArea>
    </CommentLayout>
  )
}

const CommentList = styled.div``

const CommentTextArea = styled.textarea`
  flex: 1; // 프로필 사진 제외한 나머지 너비 채움

  padding: 8px;
  
  resize: none; // 사용자가 크기 조절 불가
  max-height: 96px; // 최대 높이 설정
  overflow-y: auto; // 내용이 최대 높이를 초과할 경우 스크롤 표시

  outline: none;
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.color.secondary};

  font-size: 14px;
  color: ${({ theme }) => theme.color.font1 };
  &::placeholder {
    color: ${({ theme }) => theme.color.font2};
    opacity: 0.5;
  }

  /* 스크롤바 스타일링 */
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.color.secondary};
    border-radius: 4px;
  }
  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.color.bg3};
    border-radius: 4px;
  }
`;

const CommentProfile = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 100%;
  object-fit: cover;
`

const CommentLayout = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  width: 100%;
`
const AddCommentArea = styled.div`
  display: flex;
  gap: 16px;
`
const CommentListArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  border: 1px solid black;
`

const shakeAnimation = keyframes`
  0%, 100% { transform: rotate(0deg) scale(1.2); }
  33% { transform: rotate(-15deg) scale(1.2); }
  66% { transform: rotate(15deg) scale(1.2); }
`;

const bounceAnimation = keyframes`
  0%, 100% { transform: scale(1); }
  25% { transform: scale(1.2); }
  50% { transform: scale(1.05); }
  75% { transform: scale(1.2); }
`;

let EmojiContainer = styled.div`
  ${({ theme }) => theme.component.shadow.default};
  position: absolute;
  z-index: 1; 
  left: 0px;
  top: 52px;
  display: flex;
  flex-wrap: wrap; /* 여러 줄로 감싸기 위해 추가 */
  align-items: center;
  justify-content: space-around;
  gap: 8px;
  padding: 16px;
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: 16px;
  background-color: ${({ theme }) => theme.color.bg2};
  width: fit-content;
  max-width: 240px; /* 컨테이너의 최대 너비 설정 */
  cursor: pointer;
`;

const EmojiWrapper = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

let Emoji = styled.img`
  width: 32px;
  height: 32px;
  padding: 2px;
  border-radius: 8px;
  background-color: ${({ myReactions, emojiName, theme }) =>
    myReactions.includes(emojiName) ? theme.color.bg3 : "none"};

  &:hover {
    animation: ${shakeAnimation} 0.8s linear infinite;
  }
`;

const EmojiText = styled.div`
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%); // 가운데 정렬
  padding: 4px 8px;
  background-color: #f5f5f5;
  border-radius: 4px;
  font-size: 14px;
  color: black;
  white-space: nowrap;
`;

let FeedFooterContainer = styled.div`
  width: 100%;
  position: relative;
`;

let CommunicationBox = styled.div`
  ${({ theme }) => theme.component.flexBox.rowLeftCenter};
  gap: 1rem;
  margin: 1rem 0;
`;

let IconBox = styled.div`
  ${({ theme }) => theme.component.flexBox.rowLeftCenter};
  height: 32px;
  gap: 4px;
  padding: 12px;
  border: ${({ theme, myReactions }) => myReactions ? `1px solid ${theme.color.primary}` : `1px solid ${theme.color.border}`};
  border-radius: 8px;
  background-color: #f5f5f5;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme, myReactions }) =>
      myReactions ? `${theme.color.primary}40` : theme.color.bg3};
  }
`;

let CommentBox = styled.div`
  ${({ theme }) => theme.component.flexBox.rowLeftCenter};
  height: 32px;
  gap: 4px;
  padding: 12px;
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: 8px;
  background-color: #f5f5f5;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.color.bg3};
  }
`;

let EmojiIcon = styled.img`
  height: 20px;
  width: 20px;
`;

let AddEmoji = styled.img`
  height: 18px;
  width: 18px;
`;

let CommentFill = styled.img`
  height: 24px;
  width: 24px;
`;

let AddComment = styled.img`
  height: 19px;
  width: 20px;
`;

let EmojiCommentText = styled.span`
  font-size: 14px;
  font-weight: ${({ myReactions }) => (myReactions ? "500" : "400")};
  color: ${({ theme, myReactions }) => (myReactions ? theme.color.primary : theme.color.font2)};
  text-align: center;
  margin-left: 8px;
`;
