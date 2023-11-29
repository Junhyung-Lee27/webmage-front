import styled, { ThemeProvider } from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import componentTheme from "../components/theme";
import { useEffect, useState } from "react";
import { BASE_URL } from "./../config";
import axios from "axios";
import { setFeeds } from "../store/feedSlice";

function FollowButton({ userInfo }) {
  const dispatch = useDispatch();
  
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

  const followButtonClick = async (followingId, authToken) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/user/follow/`,
        { following_id: followingId },
        { headers: { "Content-Type": "application/json", Authorization: `Token ${authToken}` } }
      );

      // feeds 배열에서 is_following 업데이트
      const updatedFeeds = feeds.map((feed) => {
        if (feed.userInfo.id === followingId) {
          return {
            ...feed,
            userInfo: {
              ...feed.userInfo,
              is_following: true, // 팔로우 상태 업데이트
            },
          };
        }
        return feed;
      });

      dispatch(setFeeds(updatedFeeds)); // 업데이트된 feeds 배열로 상태 업데이트
    } catch (error) {
      console.error(error.response); // 오류 처리
    }
  };

    const unfollowButtonClick = async (followingId, authToken) => {
      try {
        const response = await axios.delete(`${BASE_URL}/user/unfollow/`, {
          data: { following_id: followingId },
          headers: { "Content-Type": "application/json", Authorization: `Token ${authToken}` },
        });

        // feeds 배열에서 is_following 업데이트
        const updatedFeeds = feeds.map((feed) => {
          if (feed.userInfo.id === followingId) {
            return {
              ...feed,
              userInfo: {
                ...feed.userInfo,
                is_following: false, // 언팔로우 상태 업데이트
              },
            };
          }
          return feed;
        });

        dispatch(setFeeds(updatedFeeds)); // 업데이트된 feeds 배열로 상태 업데이트
      } catch (error) {
        console.error(error.response); // 오류 처리
      }
    };

  return (
    <ThemeProvider theme={theme}>
      {userInfo.is_following ? (
        <Following onClick={() => unfollowButtonClick(userInfo.id, user.authToken)}>
          v 팔로우중
        </Following>
      ) : (
        <Follow onClick={() => followButtonClick(userInfo.id, user.authToken)}>+ 팔로우</Follow>
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
  color: ${({ theme }) => theme.color.font2 };
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
