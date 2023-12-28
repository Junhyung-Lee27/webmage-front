import styled, { ThemeProvider } from "styled-components";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import componentTheme from "./theme";
import FollowButton from "./FollowButton";

function UserRecommend({ targetUser }) {
  // 현재 url 주소
  const currentLocation = useLocation();
  
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

  // 팔로우 처리
  const followOnUserRecommend = async () => {
    setUserInfo((prevUserInfo) => ({
      ...prevUserInfo,
      is_following: true,
    }));
  };

  // 언팔로우 처리
  const unfollowOnUserRecommend = async () => {
    setUserInfo((prevUserInfo) => ({
      ...prevUserInfo,
      is_following: false,
    }));
  };

  return (
    <ThemeProvider theme={theme}>
      <RecommendContainer currentLocation={currentLocation.pathname}>
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
              onFollow={() => followOnUserRecommend()}
              onUnfollow={() => unfollowOnUserRecommend()}
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
  padding: 8px;
  /* border: 1px solid black; */
  border-radius: 8px;
  box-sizing: border-box;
  background-color: ${({ theme }) => theme.color.bg};

  &:hover {
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
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
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
  cursor: ${({ cursor = "default" }) => cursor};
`;

const FollowButtonWrapper = styled.div`
  position: absolute;
  right: 8px;
  top: 8px;
`;

export default UserRecommend;
