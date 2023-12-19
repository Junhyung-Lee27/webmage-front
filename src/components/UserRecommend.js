import styled, { ThemeProvider } from "styled-components";
import { useSelector } from "react-redux";
import componentTheme from "./theme";
import FollowButton from "./FollowButton";
import { useState } from "react";

function UserRecommend({ searchedUser }) {
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
    id: searchedUser.id,
    is_following: searchedUser.is_following,
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
              searchedUser.userImg instanceof File
                ? URL.createObjectURL(searchedUser.userImg)
                : process.env.PUBLIC_URL + "/testImg/profile2.jpg"
            }
          />
          <Column>
            <StyledText size="16" weight="500" color={theme.color.font1}>
              {searchedUser.username}
            </StyledText>
            <StyledText size="12" weight="400" color={theme.color.font2}>
              {searchedUser.userPosition}
            </StyledText>
          </Column>
          {/* <StyledAddBox
            src={process.env.PUBLIC_URL + "/icon/add.svg"}
            filter={theme.filter.primary}
          ></StyledAddBox> */}
        </Row>
        <StyledText size="12" weight="300" color={theme.color.font2}>
          {user.userHash}
        </StyledText>
        {user.userId !== searchedUser.id && (
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
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: calc((1080px - 48px) / 3);
  height: 134px;
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
  cursor: ${({ cursor = "default" }) => cursor};
`;

const FollowButtonWrapper = styled.div`
  position: absolute;
  right: 8px;
  top: 18px;
`;

export default UserRecommend;
