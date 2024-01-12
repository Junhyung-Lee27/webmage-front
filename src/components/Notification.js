import styled, { ThemeProvider } from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import componentTheme from "./theme";
import React, { useState } from "react";
import { BASE_URL } from "./../config";
import axios from "axios";
import { setSelectedUser } from "../store/selectedUserSlice";
import { useNavigate } from "react-router-dom";
import { setFeeds } from "../store/feedSlice";
import { setSelectedFeedId } from "../store/selectedFeedIdSlice";

function Notification({ notifications, setNotifications }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
  const selectedUser = useSelector((state) => state.selectedUser);
  const feeds = useSelector((state) => state.feed.feeds);
  // const [hasSelectedFeed, setHasSelectedFeed] = useState(false);

  // notification 읽음 처리 핸들러
  const handleNotiRead = async (notiId, authToken) => {
    try {
      const response = await axios.patch(
        `${BASE_URL}/noti/read/${notiId}`,
        {},
        {
          headers: {
            Authorization: `Token ${authToken}`,
          },
        }
      );

      if (response.status === 200) {
        // notifications 배열 업데이트
        const updatedNotifications = notifications.map((notif) => {
          if (notif.noti_id === notiId) {
            return { ...notif, is_read: true };
          }
          return notif;
        });

        setNotifications(updatedNotifications);
      } else {
        console.error("Failed to update notification");
      }
    } catch (error) {
      console.error("Error updating notification:", error);
    }
  };

  // 유저 선택 핸들러 (UserProfile 컴포넌트 구성에 사용)
  const handleSelectedUser = async (userId, authToken) => {
    try {
      const response = await axios.get(`${BASE_URL}/user/profile/${userId}`, {
        headers: {
          accept: "application/json",
          Authorization: `Token ${authToken}`,
        },
      });

      dispatch(setSelectedUser(response.data));
    } catch (error) {
      console.error(error);
    }
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

  return (
    <ThemeProvider theme={theme}>
      <NotiLayout>
        <NotiContainer>
          <NotiTitleBox hasNotifications={notifications.length > 0}>
            <NotiTitle>알림</NotiTitle>
            <NotiInfo>알림은 최근 30개까지만 보입니다.</NotiInfo>
          </NotiTitleBox>
          <NotiList>
            {notifications.map((notif) => (
              <NotiBox
                key={notif.noti_id}
                onClick={() => {
                  if (notif.type === "follow") {
                    handleNotiRead(notif.noti_id, user.authToken);
                    handleSelectedUser(notif.user_id, user.authToken);
                    navigate(`/manda/${selectedUser.username}`);
                  } else if (notif.type === "comment" || notif.type === "reaction") {
                    handleNotiRead(notif.noti_id, user.authToken);
                    dispatch(setSelectedFeedId(notif.feed_id));
                    navigate("/feed");
                  }
                }}
              >
                <ProfileImg src={notif.user_image} alt="profile" />
                <Contents>
                  {notif.type === "follow" && (
                    <MessageAndTime>
                      <Message>
                        <Highlight>{notif.username}</Highlight>님이 회원님을{" "}
                        <Highlight2>팔로우</Highlight2>합니다.
                      </Message>
                      <ReceivedAt>
                        {!notif.is_read && <IsReadMark>●</IsReadMark>}
                        {formatDateAgo(notif.created_at)}
                      </ReceivedAt>
                    </MessageAndTime>
                  )}
                  {notif.type === "comment" && (
                    <>
                      <MessageAndTime>
                        <Message>
                          <Highlight>{notif.username}</Highlight>님이 <Highlight2>댓글</Highlight2>
                          을 남겼어요.
                        </Message>
                        <ReceivedAt>
                          {!notif.is_read && <IsReadMark>●</IsReadMark>}
                          {formatDateAgo(notif.created_at)}
                        </ReceivedAt>
                      </MessageAndTime>
                      {notif.comment && <Comment>"{notif.comment}"</Comment>}
                    </>
                  )}
                  {notif.type === "reaction" && (
                    <>
                      <MessageAndTime>
                        <Message>
                          <Highlight>{notif.username}</Highlight>님이 회원님을{" "}
                          <Highlight2>응원</Highlight2>합니다.
                        </Message>
                        <ReceivedAt>
                          {!notif.is_read && <IsReadMark>●</IsReadMark>}
                          {formatDateAgo(notif.created_at)}
                        </ReceivedAt>
                      </MessageAndTime>
                      {notif.total_count && (
                        <TotalCount>{notif.total_count}번의 응원을 받았어요!</TotalCount>
                      )}
                    </>
                  )}
                </Contents>
              </NotiBox>
            ))}
          </NotiList>
        </NotiContainer>
      </NotiLayout>
    </ThemeProvider>
  );
}

let NotiLayout = styled.div`
  // 아이콘 하단, 가운데 정렬
  position: absolute;
  top: 100%;
  right: -16px;
  z-index: 1;

  // 기타 스타일링
  width: fit-content;
  height: fit-content;
  background-color: ${({ theme }) => theme.color.bg};
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: 16px;
`;

let NotiContainer = styled.div`
  position: relative;
  width: 420px;
`;

let NotiTitleBox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  border-bottom: ${({ theme, hasNotifications }) =>
    hasNotifications ? `1px solid ${theme.color.border}` : "none"};
  width: 100%;
  height: 40px;
  line-height: 40px;
`;

let NotiTitle = styled.span`
  padding-left: 24px;
  color: ${({ theme }) => theme.color.font1};
  font-weight: 600;
`;

let NotiInfo = styled.span`
  padding-right: 24px;
  font-size: 14px;
  color: ${({ theme }) => theme.color.font2};
  font-weight: 400;
`;

let NotiList = styled.div`
  display: flex;
  flex-direction: column;
  max-height: 400px;
  overflow-y: scroll;
  gap: 8px;

  /* 스크롤바 */
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.color.font2};
  }
`;

let NotiBox = styled.div`
  padding: 16px 24px;
  display: flex;
  gap: 8px;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.color.bg3};
  }
`;

let ProfileImg = styled.img`
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 50%;
`;

let Contents = styled.span`
  width: 100%;
  max-width: calc(100% - 40px);
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 14px;
  height: 40px;
  line-height: 20px;
  height: fit-content;
`;

let Message = styled.span`
  font-weight: 400;
  width: max-content;
  color: ${({ theme }) => theme.color.font2};
`;

let MessageAndTime = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

let Highlight = styled.span`
  color: ${({ theme }) => theme.color.primary};
  font-weight: 600;
`;

let Highlight2 = styled.span`
  color: ${({ theme }) => theme.color.secondary};
  font-weight: 600;
`;

let Comment = styled.span`
  max-width: 100%;
  font-weight: 500;
  color: ${({ theme }) => theme.color.font2};

  /* 2줄까지만 표시 */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.2em; /* 라인 높이 설정 */
  max-height: 2.4em; /* 라인 높이 * 라인 수 */
  white-space: normal;
  word-wrap: break-word;
`;

let TotalCount = styled.span`
  max-width: 100%;
  font-weight: 500;
  color: ${({ theme }) => theme.color.font2};
`;

let ReceivedAt = styled.span`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  align-items: center;
  width: 72px;
  height: fit-content;

  margin-left: 6px;
  font-size: 13px;
  color: ${({ theme }) => theme.color.font2};
`;

let IsReadMark = styled.span`
  font-size: 10px;
  color: ${({ theme }) => theme.color.primary};
`;

export default Notification;
