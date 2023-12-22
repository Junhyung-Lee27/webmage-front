import styled, { ThemeProvider } from "styled-components";
import { useSelector } from "react-redux";
import componentTheme from "./theme";
import FollowButton from "./FollowButton";
import { useState } from "react";

function UserRecommend({ targetUser }) {
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
      <RecommendContainer backgroundcolor={theme.color.bg}>
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
            <StyledText size="12" weight="400" color={theme.color.font2} margintop="auto">
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
  width: calc((1080px - 48px) / 3);
  padding: 24px;
  margin-right: 16px;
  margin-bottom: 16px;
  border-radius: 8px;
  box-sizing: border-box;
  border: 1px solid ${({ theme }) => theme.color.border};
  background-color: ${({ backgroundcolor }) => backgroundcolor};
`;

let Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 12px;
`;

let Column = styled.div`
  height: 56px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
`;

let StyledProfile = styled.img`
  width: 56px;
  height: 56px;
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: 50%;
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
  right: 20px;
  top: 20px;
`;

export default UserRecommend;
