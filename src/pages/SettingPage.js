import styled, { ThemeProvider } from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { showProfileEdit, showBlockedUsers, showDeleteAccount } from "./../store/settingpageSlice";
import Header from "../components/Header";
import ProfileEdit from "../components/ProfileEdit";
import BlockedUsers from "../components/BlockedUsers";
import DeleteAccount from "../components/DeleteAccount";
import { ReactComponent as editIcon } from "./../assets/images/edit.svg";
import { ReactComponent as blockIcon } from "./../assets/images/block.svg";
import { ReactComponent as logoutIcon } from "./../assets/images/logout.svg";
import { ReactComponent as withdrawIcon } from "./../assets/images/withdraw.svg";

function SettingPage() {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.themes[state.theme.currentTheme]);
  const activeItem = useSelector((state) => state.settingpage.activeItem);

  return (
    <ThemeProvider theme={theme}>
      <PageLayout>
        <Header></Header>
        <Body>
          <MenuLayout>
            <MenuContainer
              bordercolor={theme.border}
              onClick={() => dispatch(showProfileEdit())}
              $isActive={activeItem === "ProfileEdit"}
            >
              <StyledEditIcon />
              <MenuText marginleft="-2px">프로필 수정</MenuText>
            </MenuContainer>
            <MenuContainer
              bordercolor={theme.border}
              onClick={() => dispatch(showBlockedUsers())}
              $isActive={activeItem === "BlockedUsers"}
            >
              <StyledBlockIcon />
              <MenuText>차단/신고 리스트</MenuText>
            </MenuContainer>
            <MenuContainer bordercolor={theme.border} onClick={() => {}}>
              <StyledLogoutIcon />
              <MenuText>로그아웃</MenuText>
            </MenuContainer>
            <MenuContainer
              bordercolor={theme.border}
              onClick={() => dispatch(showDeleteAccount())}
              $isActive={activeItem === "DeleteAccount"}
            >
              <StyledWithdrawIcon />
              <MenuText>회원탈퇴</MenuText>
            </MenuContainer>
          </MenuLayout>
          {activeItem === "ProfileEdit" && <ProfileEdit />}
          {activeItem === "BlockedUsers" && <BlockedUsers />}
          {activeItem === "DeleteAccount" && <DeleteAccount />}
        </Body>
      </PageLayout>
    </ThemeProvider>
  );
}

let PageLayout = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: ${({ theme }) => theme.bg2};
`;

let Body = styled.div`
  display: flex;
  flex-direction: row;
  margin: 0px 196px;
  flex-grow: 1;
  background-color: ${({ theme }) => theme.bg};
`;

let MenuLayout = styled.div`
  display: flex;
  flex-direction: column;
  width: 240px;
  border-right: 2px solid ${({ theme }) => theme.border};
  background-color: ${({ theme }) => theme.bg};
`;

let MenuText = styled.span`
  font-size: 14px;
  margin: ${({ marginleft }) => marginleft};
  color: ${({ theme }) => theme.font1};
`;

let StyledEditIcon = styled(editIcon)`
  fill: ${({ theme }) => theme.font2};
  margin-left: 4px;
`;

let StyledBlockIcon = styled(blockIcon)`
  fill: ${({ theme }) => theme.font2};
`;

let StyledLogoutIcon = styled(logoutIcon)`
  fill: ${({ theme }) => theme.font2};
`;

let StyledWithdrawIcon = styled(withdrawIcon)`
  fill: ${({ theme }) => theme.font2};
`;

let MenuContainer = styled.div`
  height: 56px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 16px;
  padding: 0px 24px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  background-color: none;
  cursor: default;

  ${MenuText}, ${StyledEditIcon}, ${StyledBlockIcon}, ${StyledLogoutIcon}, ${StyledWithdrawIcon} {
    color: ${({ $isActive, theme }) => ($isActive ? theme.primary : theme.font1)};
    fill: ${({ $isActive, theme }) => ($isActive ? theme.primary : theme.font1)};
    font-weight: ${({ $isActive }) => ($isActive ? 700 : 500)};
  }

  &:hover {
    background-color: ${({ theme }) => theme.bg2};
  }
`;

export default SettingPage;
