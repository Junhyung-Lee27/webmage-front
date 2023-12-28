import { useSelector } from "react-redux";
import styled, { ThemeProvider } from "styled-components";
import componentTheme from "./theme";
import FollowButton from "./FollowButton";
import { useState } from "react";

export default function UserProfile() {
  // 테마
  const colorTheme = useSelector((state) => state.theme.themes[state.theme.currentTheme]);
  const filterTheme = useSelector((state) => state.theme.filters[state.theme.currentTheme]);
  const theme = {
    color: colorTheme,
    filter: filterTheme,
    component: componentTheme,
  };

  // 상태관리
  const user = useSelector((state) => state.user);
  const selectedUser = useSelector((state) => state.selectedUser);
  const [userInfo, setUserInfo] = useState({
    id: selectedUser.userId,
    is_following: selectedUser.is_following,
  });

  // 팔로우 처리
  const followOnUserProfile = async () => {
    setUserInfo((prevUserInfo) => ({
      ...prevUserInfo,
      is_following: true,
    }));
  };

  // 언팔로우 처리
  const unfollowOnUserProfile = async () => {
    setUserInfo((prevUserInfo) => ({
      ...prevUserInfo,
      is_following: false,
    }));
  };

  return (
    <ThemeProvider theme={theme}>
      <ProfileBox>
        <ProfileImageBox>
          <ProfileImage src={process.env.PUBLIC_URL + "/testImg/profile2.jpg"}></ProfileImage>
          <Username>{selectedUser.username}</Username>
        </ProfileImageBox>
        <NumericInfos>
          <CountWrapper>
            <CountLabel>팔로워</CountLabel>
            <Count>{selectedUser.followerCount}</Count>
          </CountWrapper>
          <CountWrapper>
            <CountLabel>실천</CountLabel>
            <Count>{selectedUser.successCount}</Count>
          </CountWrapper>
        </NumericInfos>
        {selectedUser.userPosition !== "" &&
        selectedUser.userInfo !== "" &&
        selectedUser.userHash !== "" ? (
          <UserDetails>
            <UserPosition>{selectedUser.userPosition}</UserPosition>
            <UserIntroduce>{selectedUser.userInfo}</UserIntroduce>
            <UserHash>{selectedUser.userHash}</UserHash>
          </UserDetails>
        ) : null}
        {user.userId !== selectedUser.userId && (
          <FollowButtonWrapper>
            <FollowButton
              userInfo={userInfo}
              onFollow={() => followOnUserProfile()}
              onUnfollow={() => unfollowOnUserProfile()}
            />
          </FollowButtonWrapper>
        )}
      </ProfileBox>
    </ThemeProvider>
  );
}

const ProfileBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 256px;
  height: fit-content;
  padding: 24px 24px 40px 24px;
  position: relative;
  background-color: ${({ theme }) => theme.color.bg};
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: 16px;
`;

const ProfileImageBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  /* position: absolute; */
  /* top: -40px; */
`;

const ProfileImage = styled.img`
  ${({ theme }) => theme.component.shadow.default};
  width: 80px;
  height: 80px;
  border-radius: 100%;
  border: none;
  object-fit: cover;
`;

const Username = styled.span`
  color: ${({ theme }) => theme.color.font1};
  font-size: 18px;
  text-align: center;
  font-weight: 600;
`;

const NumericInfos = styled.div`
  display: flex;
  width: 100%;
  /* margin-top: 90px; */
  margin-top: 40px;
`;

const CountWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
`;

const CountLabel = styled.span`
  width: 100%;
  color: ${({ theme }) => theme.color.font2};
  text-align: center;
  font-size: 14px;
  font-weight: 400;
`;

const Count = styled.span`
  color: ${({ theme }) => theme.color.font1};
  text-align: center;
  font-size: 18px;
`;

const UserDetails = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-top: 40px;
`;

const UserPosition = styled.span`
  color: ${({ theme }) => theme.color.font1};
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 16px;
`;

const UserIntroduce = styled.span`
  color: ${({ theme }) => theme.color.font1};
  font-size: 14px;
  font-weight: 400;
  margin-bottom: 32px;
`;

const UserHash = styled.span`
  color: ${({ theme }) => theme.color.font1};
  font-size: 14px;
  font-weight: 400;
`;

const FollowButtonWrapper = styled.div`
  position: absolute;
  right: 8px;
  top: 18px;
`;
