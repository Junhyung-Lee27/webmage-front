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
  const [commentsInfo, setCommentsInfo] = useState([]); // 댓글 저장하기 위한 상태
  const [commentsCount, setCommentsCount] = useState(null); // 댓글 개수 상태

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
          {feedInfo.comment_info.length >= 1 || commentsCount ? (
            <CommentBox onClick={toggleCommentComponent}>
              <CommentFill src={process.env.PUBLIC_URL + `/icon/commentFill.svg`} />
              <EmojiCommentText>
                {commentsCount ? commentsCount : feedInfo.comment_info.length}
              </EmojiCommentText>
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
        {isCommentOpen && (
          <CommentComponent
            feedInfo={feedInfo}
            commentsInfo={commentsInfo}
            setCommentsInfo={setCommentsInfo}
            commentsCount={commentsCount}
            setCommentsCount={setCommentsCount}
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

function CommentComponent(props) {
  // 상태 관리
  const user = useSelector((state) => state.user);
  const [commentInput, setCommentInput] = useState(""); // 댓글 입력 상태
  const [currentPage, setCurrentPage] = useState(1); // 댓글 페이지 상태
  const [noMoreComments, setNoMoreComments] = useState(false); // 추가 로드 가능한 댓글 상태
  const commentsInfo = props.commentsInfo; // 댓글 정보
  const setCommentsInfo = props.setCommentsInfo; // 댓글 정보 업데이트 함수
  const commentsCount = props.commentsCount; // 댓글 개수
  const setCommentsCount = props.setCommentsCount // 댓글 개수 업데이트 함수
  const [editingCommentId, setEditingCommentId] = useState(null); // 수정하는 댓글의 id
  const [editingCommentText, setEditingCommentText] = useState(""); // 수정하는 댓글의 텍스트
  const [editingCommentIndex, setEditingCommentIndex] = useState(null); // 수정하는 댓글의 인덱스

  // 댓글 조회 요청
  async function getComments(feedId, authToken, page) {
    try {
      const response = await axios.get(`${BASE_URL}/feed/${feedId}/comment?page=${page}`, {
        headers: {
          Authorization: `Token ${authToken}`,
        },
      });
      if (response.data.message === "No more pages") {
        setNoMoreComments(true);
        return;
      }
      
      if (page === 1) {
        setCommentsInfo(response.data.comment_info);
        setCommentsCount(response.data.count);
      } else {
        setCommentsInfo((prevComments) => [...prevComments, ...response.data.comment_info]);
      }
    } catch (error) {
      console.log("댓글 조회 중 오류 발생: ", error);
    }
  }

  // "댓글 더보기" 버튼 클릭 이벤트
  const handleLoadMoreComments = () => {
    const newPage = currentPage + 1;
    getComments(props.feedInfo.id, user.authToken, newPage);
    setCurrentPage(newPage);
  };

  // 초기 댓글 요청
  useEffect(() => {
    getComments(props.feedInfo.id, user.authToken, currentPage);
  }, []);

  // 댓글 입력 요청
  async function submitAddComment(e, feedId, authToken, commentInput) {
    const trimmedCommentInput = commentInput.trim();

    if (e.key === "Enter" && !e.shiftKey && trimmedCommentInput !== "") {
      e.preventDefault();
      try {
        const response = await axios.post(
          `${BASE_URL}/feed/${feedId}/comment/add/`,
          { comment: trimmedCommentInput },
          {
            headers: {
              Authorization: `Token ${authToken}`,
            },
          }
        );

        if (response.status === 201 || response.status === 200) {
          const newComment = response.data;
          setCommentsInfo((prevComments) => [newComment, ...prevComments]);
          setCommentInput("");
          setCommentsCount((prevCount) => prevCount + 1);
        }
      } catch (error) {
        console.log("댓글 작성 중 오류 발생 : ", error);
      }
    }
  }

  // 댓글 필드에 입력된 값
  const handleCommentInput = (e) => {
    // 입력 창 높이 조절
    e.target.style.height = "inherit";
    e.target.style.height = `${e.target.scrollHeight}px`;

    // 댓글 입력 상태 업데이트
    setCommentInput(e.target.value);
  };

  // 날짜 형식 변환
  const formatDateAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);
    if (years > 0) {
      return `${years}년 전`;
    } else if (months > 0) {
      return `${months}개월 전`;
    } else if (days > 6) {
      const weeks = Math.floor(days / 7);
      return `${weeks}주일 전`;
    } else if (days > 0) {
      return `${days}일 전`;
    } else if (hours > 0) {
      return `${hours}시간 전`;
    } else if (minutes > 0) {
      return `${minutes}분 전`;
    } else {
      return `${seconds}초 전`;
    }
  };

  // 댓글 수정 모드 활성화
  const handleEditComment = (comment, index) => {
    setEditingCommentId(comment.id);
    setEditingCommentIndex(index);
    setEditingCommentText(comment.comment);
  };

  // 댓글 수정 요청
  const submitEditComment = async (
    e,
    feedId,
    commentId,
    authToken,
    originalCommentText,
    commentText
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Enter 키 기본 동작 방지

      if (originalCommentText !== commentText) {
        try {
          const response = await axios.patch(
            `${BASE_URL}/feed/${feedId}/comment/${commentId}/edit/`,
            { comment: commentText },
            {
              headers: {
                Authorization: `Token ${authToken}`,
              },
            }
          );

          if (response.status === 200 && editingCommentIndex !== null) {
            const now = new Date().toISOString();
            const updatedComments = [...commentsInfo];
            updatedComments[editingCommentIndex] = {
              ...updatedComments[editingCommentIndex],
              comment: commentText,
              updated_at: now,
            };
            const newPage = Math.floor(editingCommentIndex / 5) + 1;
            setCurrentPage(newPage);

            setCommentsInfo(updatedComments);
            setEditingCommentId(null);
            setEditingCommentIndex(null);
          }
        } catch (error) {
          console.log("댓글 수정 중 오류 발생: ", error);
        }
      }
    }
  };

  // 댓글 수정 텍스트필드 높이 조절
  const handleEditingTextArea = (e) => {
    e.target.style.height = "inherit";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  // 댓글 삭제 요청
  const submitDeleteComment = async (feedId, commentId, authToken) => {
    try {
      const response = await axios.delete(
        `${BASE_URL}/feed/${feedId}/comment/${commentId}/delete/`,
        {
          headers: {
            Authorization: `Token ${authToken}`,
          },
        }
      );

      if (response.status === 204) {
        // 삭제된 댓글을 목록에서 제거
        const updatedComments = commentsInfo.filter((comment) => comment.id !== commentId);
        setCommentsInfo(updatedComments);
        if (commentsCount != 1) {
          setCommentsCount((prevCount) => prevCount - 1);
        } else {
          setCommentsCount(null);
        }
      }
    } catch (error) {
      console.log("댓글 삭제 중 오류 발생: ", error);
    }
  };

  return (
    <CommentLayout>
      <AddCommentArea>
        <CommentProfile src={process.env.PUBLIC_URL + "/testImg/profile2.jpg"}></CommentProfile>
        <CommentTextArea
          value={commentInput}
          onInput={handleCommentInput}
          onKeyDown={(e) => submitAddComment(e, props.feedInfo.id, user.authToken, commentInput)}
          placeholder="댓글 남기기"
          rows="1"
        ></CommentTextArea>
      </AddCommentArea>
      <CommentListArea>
        {commentsInfo.map((comment, index) => (
          <CommentList key={comment.id}>
            <CommentProfile src={process.env.PUBLIC_URL + "/testImg/profile2.jpg"}></CommentProfile>
            <CommentInfo>
              <CommentUsernameAndTime>
                <CommentUsername>{comment.username}</CommentUsername>
                <CommentTime>{formatDateAgo(comment.created_at)}</CommentTime>
                {comment.created_at != comment.updated_at ? <Updated>(수정됨)</Updated> : null}
              </CommentUsernameAndTime>
              <CommentTextContainer>
                {editingCommentId === comment.id ? (
                  <EditingTextArea
                    value={editingCommentText}
                    onChange={(e) => setEditingCommentText(e.target.value)}
                    onInput={handleEditingTextArea}
                    onKeyDown={(e) =>
                      submitEditComment(
                        e,
                        props.feedInfo.id,
                        comment.id,
                        user.authToken,
                        comment.comment,
                        editingCommentText
                      )
                    }
                  />
                ) : (
                  <CommentText>{comment.comment}</CommentText>
                )}
                <CommentOptionMenu
                  user={user}
                  feedId={props.feedInfo.id}
                  getComments={getComments}
                  setCurrentPage={setCurrentPage}
                  comment={comment}
                  commentsInfo={commentsInfo}
                  setCommentsInfo={setCommentsInfo}
                  commentsCount={commentsCount}
                  setCommentsCount={setCommentsCount}
                  onEdit={() => handleEditComment(comment, index)}
                  onDelete={() =>
                    submitDeleteComment(props.feedInfo.id, comment.id, user.authToken)
                  }
                />
              </CommentTextContainer>
            </CommentInfo>
          </CommentList>
        ))}
        {props.commentsCount > 5 &&
          commentsInfo.length < props.commentsCount &&
          !noMoreComments && (
            <LoadMoreButton onClick={handleLoadMoreComments}>댓글 더보기</LoadMoreButton>
          )}
      </CommentListArea>
    </CommentLayout>
  );
}

function CommentOptionMenu(props) {
  // 테마
  const colorTheme = useSelector((state) => state.theme.themes[state.theme.currentTheme]);
  const filterTheme = useSelector((state) => state.theme.filters[state.theme.currentTheme]);
  const theme = {
    color: colorTheme,
    filter: filterTheme,
    component: componentTheme,
  };

  // 상태 관리
  const [isCommentOptionOpen, setIsCommentOptionOpen] = useState(false); // 댓글 옵션 열림 상태
  const [isReportCommentModalOpen, setIsReportCommentModalOpen] = useState(false); // 댓글 신고 모달
  const [isReportCommentSuccess, setIsReportCommentSuccess] = useState(false); // 댓글 신고 상태
  const [isBlockUserModalOpen, setIsBlockUserModalOpen] = useState(false); // 유저 차단 모달
  const [reportedCommentId, setReportedCommentId] = useState(null); // 신고한 댓글
  const user = props.user;
  const comment = props.comment;

  return (
    <CommentOptionWrapper>
      <CommentOptionIcon
        onClick={() => setIsCommentOptionOpen((prevState) => !prevState)}
        src={process.env.PUBLIC_URL + "/icon/menu-horizontal.svg"}
      ></CommentOptionIcon>
      {isCommentOptionOpen && (
        <OptionLayout>
          {user.userId === comment.user ? (
            <>
              <Option onClick={props.onEdit}>댓글 수정</Option>
              <Option onClick={props.onDelete}>댓글 삭제</Option>
            </>
          ) : (
            <>
              <Option
                onClick={() => {
                  setIsReportCommentModalOpen(true);
                }}
              >
                댓글 신고
              </Option>
              {isReportCommentModalOpen === true && (
                <ReportCommentModal
                  user={user}
                  comment={comment}
                  commentsInfo={props.commentsInfo}
                  setCommentsInfo={props.setCommentsInfo}
                  commentsCount = {props.commentsCount}
                  setCommentsCount = {props.setCommentsCount}
                  setIsReportCommentModalOpen={setIsReportCommentModalOpen}
                  setIsReportCommentSuccess={setIsReportCommentSuccess}
                  setIsBlockUserModalOpen={setIsBlockUserModalOpen}
                  reportedCommentId={reportedCommentId}
                  setReportedCommentId={setReportedCommentId}
                />
              )}
              {isBlockUserModalOpen && (
                <BlockUserModal
                  theme={theme}
                  setIsBlockUserModalOpen={setIsBlockUserModalOpen}
                  user={user}
                  comment={comment}
                  feedId={props.feedId}
                  getComments={props.getComments}
                  setCurrentPage={props.setCurrentPage}
                  commentsInfo={props.commentsInfo}
                  setCommentsInfo={props.setCommentsInfo}
                  commentsCount = {props.commentsCount}
                  setCommentsCount = {props.setCommentsCount}
                  isReportCommentSuccess={isReportCommentSuccess}
                  reportedCommentId={reportedCommentId}
                  setReportedCommentId={setReportedCommentId}
                ></BlockUserModal>
              )}
            </>
          )}
        </OptionLayout>
      )}
    </CommentOptionWrapper>
  );
}

function ReportCommentModal(props) {
  // 테마
  const colorTheme = useSelector((state) => state.theme.themes[state.theme.currentTheme]);
  const filterTheme = useSelector((state) => state.theme.filters[state.theme.currentTheme]);
  const theme = {
    color: colorTheme,
    filter: filterTheme,
    component: componentTheme,
  };

  // 상태 관리
  const [reportReason, setReportReason] = useState("");
  const [otherReason, setOtherReason] = useState("");
  const user = props.user;
  const comment = props.comment;
  const commentsInfo = props.commentsInfo;
  const setCommentsInfo = props.setCommentsInfo;
  const commentsCount = props.commentsCount;
  const setCommentsCount = props.setCommentsCount;

  // 댓글 신고 처리
  const handleReportComment = async (user, commentId, reason, otherReason) => {
    if (!reason) {
      alert("신고 사유를 선택해주세요.");
      return;
    }

    let finalReason = reason === "기타" ? otherReason : reason;

    try {
      const response = await axios.post(
        `${BASE_URL}/feed/comment/${commentId}/report/`,
        { reason: finalReason },
        {
          headers: { "Content-Type": "application/json", Authorization: `Token ${user.authToken}` },
        }
      );
      if (response.status === 201) {
        alert("댓글이 신고되었습니다");

        props.setReportedCommentId(commentId); // 신고한 댓글 id 저장 -> 유저 차단 결정 이후 처리
        props.setIsReportCommentModalOpen(false); // 신고 모달 -> off
        props.setIsBlockUserModalOpen(true); // 유저 차단 모달 -> on
        props.setIsReportCommentSuccess(true); // 신고 상태 -> true
      }
    } catch (error) {
      console.error("Failed to Report:", error);
      alert("댓글 신고 중 오류가 발생했습니다.");
    }
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <ModalTitle>
          댓글을 <Highlight>신고</Highlight>하시겠습니까?
        </ModalTitle>
        <DropdownMenu value={reportReason} onChange={(e) => setReportReason(e.target.value)}>
          <option value="">신고 사유 선택...</option>
          <option value="스팸 또는 광고">스팸 또는 광고</option>
          <option value="혐오 발언 또는 괴롭힘">혐오 발언 또는 괴롭힘</option>
          <option value="부적절한 내용">부적절한 내용</option>
          <option value="저작권 침해">저작권 침해</option>
          <option value="기타">기타</option>
        </DropdownMenu>
        {reportReason === "기타" && (
          <TextField
            value={otherReason}
            onChange={(e) => setOtherReason(e.target.value)}
            placeholder="신고 사유 입력"
          />
        )}
        <Buttons>
          <StyledButton
            onClick={() => props.setIsReportCommentModalOpen(false)}
            color={theme.color.font1}
            backgroundcolor={theme.color.bg3}
            border="none"
          >
            돌아가기
          </StyledButton>
          <StyledButton
            onClick={() => handleReportComment(user, comment.id, reportReason, otherReason)}
            color="white"
            backgroundcolor={theme.color.primary}
          >
            신고
          </StyledButton>
        </Buttons>
      </ModalContent>
    </ModalOverlay>
  );
}

function BlockUserModal(props) {
  // 테마
  const colorTheme = useSelector((state) => state.theme.themes[state.theme.currentTheme]);
  const filterTheme = useSelector((state) => state.theme.filters[state.theme.currentTheme]);
  const theme = {
    color: colorTheme,
    filter: filterTheme,
    component: componentTheme,
  };

  // 상태관리
  const user = props.user;
  const comment = props.comment;
  const commentsInfo = props.commentsInfo;
  const setCommentsInfo = props.setCommentsInfo;
  const setCommentsCount = props.setCommentsCount;

  const handleBlockUser = async (user, targetUser) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/user/block/`,
      { blocked_id: targetUser },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${user.authToken}`,
        },
      }
    );
    if (response.status === 201) {
      alert("유저가 차단되었습니다");
      // const updatedComments = commentsInfo.filter((c) => c.user !== targetUser && c.id !== props.reportedCommentId);
      // setCommentsInfo(updatedComments);
      // const removedCommentsCount = commentsInfo.length - updatedComments.length;
      // setCommentsCount((prevCount) => prevCount - removedCommentsCount);
      const newPage = 1;
      props.setCurrentPage(newPage);
      props.getComments(props.feedId, user.authToken, newPage);
      props.setIsBlockUserModalOpen(false);
    }
  } catch (error) {
    console.error("Failed to block:", error);
    alert("유저 차단 중 오류가 발생했습니다.");
  }
};

  return (
    <ModalOverlay>
      <ModalContent>
        <ModalTitle>
          {comment.username} 유저를 <Highlight>차단</Highlight>하시겠습니까?
        </ModalTitle>
        <Buttons>
          <StyledButton
            onClick={() => {
              props.setIsBlockUserModalOpen(false);
              props.setCommentsInfo(props.commentsInfo.filter(prevComment => prevComment.id !== props.reportedCommentId));
              props.setCommentsCount((prevCount) => prevCount - 1);
            }}
            color={theme.color.font1}
            backgroundcolor={theme.color.bg3}
            border="none"
          >
            돌아가기
          </StyledButton>
          <StyledButton
            onClick={() => handleBlockUser(user, comment.user)}
            color="white"
            backgroundcolor={theme.color.primary}
          >
            차단
          </StyledButton>
        </Buttons>
      </ModalContent>
    </ModalOverlay>
  );
}

let ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7); /* 검정색 배경에 70% 투명도 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

let ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  background-color: ${({ theme }) => theme.color.bg};
  padding: 40px 80px;
  border-radius: 8px;
  width: 500px;
  max-height: 100%;
`;

let ModalTitle = styled.span`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.color.font1};
  margin-bottom: 32px;
  text-align: center;
  width: 100%;
`;
let Highlight = styled.span`
  color: ${({ theme }) => theme.color.primary};
`;

const DropdownMenu = styled.select`
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const TextField = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

let Buttons = styled.div`
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  gap: 8px;
  /* margin-top: 32px; */
  padding: 8px 0px;
`;

let StyledButton = styled.button`
  height: 42px;
  font-size: 16px;
  font-weight: 700;
  line-height: 20px;
  width: 50%;
  padding: 12px 24px;
  color: ${({ color }) => color};
  background-color: ${({ backgroundcolor }) => backgroundcolor};
  border: none;
  border-radius: 8px;
  outline: none;
  cursor: pointer;
`;

const LoadMoreButton = styled.button`
  border: none;
  background: none;
  color: ${({ theme }) => theme.color.font2};
  font-weight: 600;
  font-size: 14px;
  padding: 8px 12px;
  width: fit-content;

  &:hover {
    text-decoration: underline;
  }
`;

const CommentOptionIcon = styled.img`
  width: 16px;
  height: 16px;

  box-sizing: content-box;
  padding: 2px;
  /* margin: -4px -4px 0px 0px; */
  border-radius: 50%;
  border: none;
  cursor: pointer;
  &:hover {
    transition: 0.3s;
    background-color: ${({ theme }) => theme.color.bg2};
  }
`;

const CommentOptionWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
`;

const CommentText = styled.p`
  color: ${({ theme }) => theme.color.font1};
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
`;

const CommentTextContainer = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;

  width: 100%;
  padding: 12px 16px;
  border-radius: 0px 16px 16px 16px;
  background-color: ${({ theme }) => theme.color.bg3};

  word-break: break-word;
`;

const EditingTextArea = styled.textarea`
  width: 90%;
  background: none;
  border: none;
  outline: none;
  resize: none;
  font-size: 14px;
  color: ${({ theme }) => theme.color.font1};

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

const CommentUsername = styled.span`
  color: ${({ theme }) => theme.color.font1};
  font-size: 14px;
  font-weight: 400;
  margin-right: auto;
`;

const CommentTime = styled.span`
  color: ${({ theme }) => theme.color.font2};
  font-size: 14px;
  font-weight: 300;
`;

const Updated = styled(CommentTime)``;

const CommentUsernameAndTime = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
`;

const CommentInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const CommentList = styled.div`
  display: flex;
  width: 100%;
  gap: 16px;
`;

const CommentTextArea = styled.textarea`
  height: 100%;
  flex: 1;
  padding: 8px;

  resize: none; // 사용자가 크기 조절 불가
  max-height: 96px; // 최대 높이 설정
  overflow-y: auto; // 내용이 최대 높이를 초과할 경우 스크롤 표시

  outline: none;
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.color.secondary};

  font-size: 14px;
  color: ${({ theme }) => theme.color.font1};
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
`;

const CommentLayout = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  width: 100%;
`;
const AddCommentArea = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
`;
const CommentListArea = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  gap: 24px;
`;

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
  border: ${({ theme, myReactions }) =>
    myReactions ? `1px solid ${theme.color.primary}` : `1px solid ${theme.color.border}`};
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

let OptionLayout = styled.div`
  ${({ theme }) => theme.component.shadow.default};
  position: absolute;
  z-index: 5;
  top: 100%;
  right: calc(100% - 1.4rem);
  width: 160px;
  height: fit-content;
  background-color: ${({ theme }) => theme.color.bg};
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.color.border};
`;

let OptionContainer = styled.div`
  position: relative;
`;

let Option = styled.li`
  padding: 16px 24px;
  text-align: center;
  cursor: pointer;
  list-style-type: none;

  &:hover {
    background-color: ${({ theme }) => theme.color.bg3};
  }
`;
