import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled, { ThemeProvider, keyframes } from "styled-components";
import { BASE_URL } from "./../config";
import axios from "axios";
import componentTheme from "./theme";
import { setFeeds } from "../store/feedSlice";

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
  const feeds = useSelector((state) => state.feed.feeds);
  const feedInfo = props.feedInfo;
  const [myReaction, setMyReaction] = useState(""); // 피드에 대한 자신의 이모지
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
      setMyReaction(response.data.user_reaction);
    } catch (error) {
      console.log("이모지 카운트 조회 중 오류 발생: ", error);
      alert("이모지 카운트 조회 중 오류가 발생했습니다");
    }
  }

  // 이모지 입력 또는 수정
  async function addOrUpdateEmoji(feedId, emojiName, authToken) {
    try {
      const response = await axios.post(
        `${BASE_URL}/feed/emoji/add_or_update/`,
        { feed_id: feedId, emoji_name: emojiName },
        {
          headers: {
            Authorization: `Token ${authToken}`,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        let newEmojiInfo = { ...emojiInfoRaw };
        if (myReaction) {
          // 이모지 상태에 기존 이모지 값 -1 and 새로운 이모지 값 +1
          if (myReaction !== emojiName) {
            newEmojiInfo[myReaction] = (newEmojiInfo[myReaction] || 1) - 1;
            newEmojiInfo[emojiName] = (newEmojiInfo[emojiName] || 0) + 1;
          }
        } else {
          // 이모지 상태에 새로운 이모지 값 +1
          newEmojiInfo[emojiName] = (newEmojiInfo[emojiName] || 0) + 1;
        }

        setEmojiInfoRaw(newEmojiInfo);
        setEmojiInfo(getEmojiInfo(newEmojiInfo));
        setMyReaction(emojiName);
      }
    } catch (error) {
      console.log("이모지 입력/수정 중 오류 발생: ", error);
      alert("이모지 입력/수정 중 오류가 발생했습니다.");
    }
  }

  // 이모지 취소
  async function removeEmoji(feedId, authToken) {
    if (myReaction) {
      try {
        const response = await axios.delete(`${BASE_URL}/feed/emoji/remove/`, {
          data: { feed_id: feedId },
          headers: { "Content-Type": "application/json", Authorization: `Token ${authToken}` },
        });

        if (response.status === 204) {
          let newEmojiInfo = { ...emojiInfoRaw };
          newEmojiInfo[myReaction] = Math.max(newEmojiInfo[myReaction] - 1, 0);

          setEmojiInfoRaw(newEmojiInfo);
          setEmojiInfo(getEmojiInfo(newEmojiInfo));
          setMyReaction("");
        }
      } catch (error) {
        console.log("이모지 취소 중 오류 발생: ", error);
        alert("이모지 취소 중 오류가 발생했습니다.");
      }
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

  // 가장 많은 이모지 2가지, 총 카운트 추출
  const getEmojiInfo = (emoji_count) => {
    let maxKey = null;
    let nextMaxKey = null;
    let maxVal = -Infinity;
    let nextMaxVal = -Infinity;
    let total_count = 0;

    for (let key in emoji_count) {
      total_count += emoji_count[key];
      if (emoji_count[key] != 0) {
        if (emoji_count[key] > maxVal) {
          nextMaxKey = maxKey;
          nextMaxVal = maxVal;
          maxKey = key;
          maxVal = emoji_count[key];
        } else if (emoji_count[key] > nextMaxVal) {
          nextMaxKey = key;
          nextMaxVal = emoji_count[key];
        }
      }
    }
    return { total_count, maxKey, nextMaxKey };
  };

  // EmojiModal 토글 함수
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

  return (
    <ThemeProvider theme={theme}>
      <FeedFooterContainer>
        <CommunicationBox>
          {emojiInfo.total_count >= 1 ? (
            <IconBox
              onClick={() => removeEmoji(feedInfo.id, user.authToken)}
              onMouseEnter={() => {
                const timerId = setTimeout(() => {
                  openEmojiModal();
                }, 300);
                setModalTimerId(timerId);
              }}
              onMouseLeave={() => {
                if (modalTimerId) {
                  clearTimeout(modalTimerId);
                  setModalTimerId(null);
                }
                const newModalTimerId = setTimeout(() => {
                  closeEmojiModal();
                }, 1000);
                setModalTimerId(newModalTimerId);
              }}
              myReaction={myReaction}
            >
              <EmojiIcon src={process.env.PUBLIC_URL + `/icon/${emojiInfo.maxKey}.svg`} />
              {emojiInfo.nextMaxKey && (
                <EmojiIcon src={process.env.PUBLIC_URL + `/icon/${emojiInfo.nextMaxKey}.svg`} />
              )}
              <EmojiCommentText myReaction={myReaction}>{emojiInfo.total_count}명</EmojiCommentText>
            </IconBox>
          ) : (
            <IconBox
              onMouseEnter={openEmojiModal}
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
          {feedInfo.comment_info.length >= 1 ? (
            <CommentBox>
              <CommentFill src={process.env.PUBLIC_URL + `/icon/commentFill.svg`} />
              <EmojiCommentText>{feedInfo.comment_info.length}</EmojiCommentText>
            </CommentBox>
          ) : (
            <CommentBox>
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
            addOrUpdateEmoji={addOrUpdateEmoji}
          />
        )}
      </FeedFooterContainer>
    </ThemeProvider>
  );
}

function EmojiModal(props) {
  // 상태 관리
  const user = useSelector((state) => state.user);
  const [hoveredEmoji, setHoveredEmoji] = useState("");
  const handleEmojiMouseEnter = (emojiName) => {
    setHoveredEmoji(emojiName);
  };
  const handleEmojiMouseLeave = () => {
    setHoveredEmoji("");
  };

  // 이모지 클릭 이벤트
  const handleEmojiClick = (emojiName) => {
    props.addOrUpdateEmoji(props.feedInfo.id, emojiName, user.authToken);
    props.closeEmojiModal();
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
      <EmojiWrapper
        onMouseEnter={() => handleEmojiMouseEnter("최고에요")}
        onMouseLeave={handleEmojiMouseLeave}
      >
        <Emoji
          src={process.env.PUBLIC_URL + `/icon/like.svg`}
          onClick={() => handleEmojiClick("like")}
        ></Emoji>
        {hoveredEmoji === "최고에요" && <EmojiText>최고에요</EmojiText>}
      </EmojiWrapper>
      <EmojiWrapper
        onMouseEnter={() => handleEmojiMouseEnter("좋아요")}
        onMouseLeave={handleEmojiMouseLeave}
      >
        <Emoji
          src={process.env.PUBLIC_URL + `/icon/heart.svg`}
          onClick={() => handleEmojiClick("heart")}
        ></Emoji>
        {hoveredEmoji === "좋아요" && <EmojiText>좋아요</EmojiText>}
      </EmojiWrapper>
      <EmojiWrapper
        onMouseEnter={() => handleEmojiMouseEnter("스마일")}
        onMouseLeave={handleEmojiMouseLeave}
      >
        <Emoji
          src={process.env.PUBLIC_URL + `/icon/smile.svg`}
          onClick={() => handleEmojiClick("smile")}
        ></Emoji>
        {hoveredEmoji === "스마일" && <EmojiText>스마일</EmojiText>}
      </EmojiWrapper>
      <EmojiWrapper
        onMouseEnter={() => handleEmojiMouseEnter("슬퍼요")}
        onMouseLeave={handleEmojiMouseLeave}
      >
        <Emoji
          src={process.env.PUBLIC_URL + `/icon/sad.svg`}
          onClick={() => handleEmojiClick("sad")}
        ></Emoji>
        {hoveredEmoji === "슬퍼요" && <EmojiText>슬퍼요</EmojiText>}
      </EmojiWrapper>
      <EmojiWrapper
        onMouseEnter={() => handleEmojiMouseEnter("화나요")}
        onMouseLeave={handleEmojiMouseLeave}
      >
        <Emoji
          src={process.env.PUBLIC_URL + `/icon/angry.svg`}
          onClick={() => handleEmojiClick("sad")}
        ></Emoji>
        {hoveredEmoji === "화나요" && <EmojiText>화나요</EmojiText>}
      </EmojiWrapper>
    </EmojiContainer>
  );
}

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
  position: absolute;
  bottom: 80%;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  border: ${({ theme }) => theme.color.border};
  border-radius: 16px;
  background-color: ${({ theme }) => theme.color.bg2};
  width: fit-content;
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
  /* position: relative; */
  width: 28px;
  height: 28px;

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
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: 8px;
  background-color: ${({ theme, myReaction }) =>
    myReaction ? `${theme.color.primary}30` : "#F5F5F5"};
  cursor: pointer;

  &:hover {
    background-color: ${({ theme, myReaction }) =>
      myReaction ? `${theme.color.primary}40` : theme.color.bg3};
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
  font-weight: ${({ myReaction }) =>
    myReaction ? "500" : "400"};
  color: ${({ theme, myReaction }) =>
    myReaction ? theme.color.font1 : theme.color.font2};
  text-align: center;
  margin-left: 8px;
`;
