import styled, { ThemeProvider } from "styled-components";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import componentTheme from "./theme";
import axios from "axios";
import { BASE_URL } from "./../config";
import FollowButton from "./FollowButton";
import { setSelectedUser } from "../store/selectedUserSlice";

function UserRecommend({ targetUser }) {
  const currentLocation = useLocation();
  let navigate = useNavigate();
  let dispatch = useDispatch();

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
  const [userInfo, setUserInfo] = useState({
    id: targetUser.id,
    is_following: targetUser.is_following,
  });
  const selectedUser = useSelector((state) => state.selectedUser);

  // 팔로우 처리
  const followOnUserRecommend = async (event) => {
    event.stopPropagation();
    setUserInfo((prevUserInfo) => ({
      ...prevUserInfo,
      is_following: true,
    }));
  };

  // 언팔로우 처리
  const unfollowOnUserRecommend = async (event) => {
    event.stopPropagation();
    setUserInfo((prevUserInfo) => ({
      ...prevUserInfo,
      is_following: false,
    }));
  };

  // 특정 유저의 프로필 불러오기 함수
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

  return (
    <ThemeProvider theme={theme}>
      <RecommendContainer
        currentLocation={currentLocation.pathname}
        onClick={() => {
          handleSelectedUser(userInfo.id, user.authToken);
          navigate(`/manda/${selectedUser.username}`);
        }}
      >
        <Row>
          <StyledProfile
            src={
              targetUser.userImg instanceof File
                ? URL.createObjectURL(targetUser.userImg)
                : process.env.PUBLIC_URL + "/testImg/profile2.jpg"
            }
          />
          <Column>
            <StyledText size="16" weight="500" color={theme.color.font1}>
              {targetUser.username}
            </StyledText>
            <StyledText size="12" weight="400" color={theme.color.font2}>
              {targetUser.userPosition}
            </StyledText>
            <StyledText size="12" weight="400" color={theme.color.font2}>
              {targetUser.userHash}
            </StyledText>
          </Column>
        </Row>
        {user.userId !== targetUser.id && (
          <FollowButtonWrapper>
            <FollowButton
              userInfo={userInfo}
              onFollow={(event) => followOnUserRecommend(event)}
              onUnfollow={(event) => unfollowOnUserRecommend(event)}
            />
          </FollowButtonWrapper>
        )}
      </RecommendContainer>
    </ThemeProvider>
  );
}

let RecommendContainer = styled.div`
  position: relative;
  width: ${({ currentLocation }) =>
    currentLocation === "/feed" ? "100%" : "calc((100% - 16px) / 2)"};
  padding: 16px 12px;
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: 8px;
  box-sizing: border-box;
  background-color: ${({ theme }) => theme.color.bg};

  cursor: pointer;
  &:hover {
    transition: 0.3s;
    background-color: ${({ theme }) => theme.color.bg3};
  }
`;

let Row = styled.div`
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 12px;
`;

let Column = styled.div`
  height: 64px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  /* align-items: ; */
  gap: 4px;
  padding: 4px 0px;
`;

let StyledProfile = styled.img`
  width: 64px;
  height: 64px;
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: 50%;
  box-sizing: border-box;
  object-fit: cover;
`;

let StyledText = styled.span`
  font-size: ${({ size }) => size + "px"};
  font-weight: ${({ weight }) => weight};
  color: ${({ color }) => color};

  margin-top: ${({ margintop }) => margintop};
`;

const FollowButtonWrapper = styled.div`
  position: absolute;
  right: 12px;
  top: 16px;
`;

export default UserRecommend;
