import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import styled, { ThemeProvider } from "styled-components";
import componentTheme from "../components/theme";
import { BASE_URL } from "./../config";
import { WS_BASE_URL } from "./../config";

function FollowButton({ userInfo, onFollow, onUnfollow }) {
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
  const [isMounted, setIsMounted] = useState(false); // 팔로우버튼 마운트 상태

  // 마운트 설정
  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    }
  }, [])

  const followButtonClick = async (event, followedId, user) => {
    event.stopPropagation(); // 이벤트 버블링 방지

    // 임시 웹소켓 연결 생성
    const tempWs = new WebSocket(
      `${WS_BASE_URL}/ws/notifications/${user.userId}/?token=${user.authToken}`
    );

    try {
      const response = await axios.post(
        `${BASE_URL}/user/follow/`,
        { following_id: followedId },
        {
          headers: { "Content-Type": "application/json", Authorization: `Token ${user.authToken}` },
        }
      );

      if (response.status === 201 && isMounted) {
        // 웹소켓을 통해 팔로우 이벤트 메시지 전송
        tempWs.send(
          JSON.stringify({
            type: "follow_event",
            followed_user_id: followedId,
            username: user.username,
            user_id: user.userId,
            user_image: user.userImg,
          })
        );
        // 팔로우 상태 업데이트
        await onFollow(event);
      }
    } catch (error) {
      console.log("팔로우 중 오류 발생: ", error); // 오류 처리
    } finally {
      // 웹소켓 연결 닫기
      setTimeout(() => {
        tempWs.close();
      }, 5000);
    }
  };

  const unfollowButtonClick = async (event, followedId, authToken) => {
    event.stopPropagation(); // 이벤트 버블링 방지

    try {
      const response = await axios.delete(`${BASE_URL}/user/unfollow/`, {
        data: { following_id: followedId },
        headers: { "Content-Type": "application/json", Authorization: `Token ${authToken}` },
      });

      if (response.status === 204 && isMounted) {
        await onUnfollow(event);
      }
    } catch (error) {
      console.log("팔로우 취소중 오류 발생: ", error); // 오류 처리
    }
  };

  return (
    <ThemeProvider theme={theme}>
      {userInfo.is_following ? (
        <Following onClick={(event) => unfollowButtonClick(event, userInfo.id, user.authToken)}>
          v 팔로우중
        </Following>
      ) : (
        <Follow onClick={(event) => followButtonClick(event, userInfo.id, user)}>+ 팔로우</Follow>
      )}
    </ThemeProvider>
  );
}

let Follow = styled.button`
  border: none;
  background: none;
  color: ${({ theme }) => theme.color.primary};
  border-radius: 0.25rem;
  font-size: 14px;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  flex-shrink: 0;

  &:hover {
    background-color: ${({ theme }) => theme.color.primary};
    color: white;
    transition: 0.3s;
  }
`;
let Following = styled.button`
  border: none;
  background: none;
  color: ${({ theme }) => theme.color.font2};
  border-radius: 0.25rem;
  font-size: 14px;
  font-weight: 500;
  padding: 0.25rem 0.5rem;
  flex-shrink: 0;

  &:hover {
    background-color: ${({ theme }) => theme.color.font2};
    color: white;
    transition: 0.3s;
  }
`;

export default FollowButton;
