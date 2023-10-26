import styled, { ThemeProvider } from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { showProfileEdit, showBlockedUsers, showDeleteAccount } from "./../store/settingpageSlice";
import Header from "../components/Header";
import ProfileEdit from "../components/ProfileEdit";
import BlockedUsers from "../components/BlockedUsers";
import DeleteAccount from "../components/DeleteAccount";
import componentTheme from "./../components/theme"

function SettingPage() {
  const dispatch = useDispatch();
  
  const colorTheme = useSelector((state) => state.theme.themes[state.theme.currentTheme]);
  const filterTheme = useSelector((state) => state.theme.filters[state.theme.currentTheme]);
  const theme = {
    color: colorTheme,
    filter: filterTheme,
    component: componentTheme,
  };

  const activeItem = useSelector((state) => state.settingpage.activeItem);

  return (
    <ThemeProvider theme={theme}>
      <PageLayout>
        <Header></Header>
        <Body>
          <MenuLayout>
            <MenuContainer
              bordercolor={theme.color.border}
              onClick={() => dispatch(showProfileEdit())}
              $isActive={activeItem === "ProfileEdit"}
            >
              <MediumIcon
                src={process.env.PUBLIC_URL + "/icon/edit.svg"}
                filter={theme.filter.font1}
              />
              <MenuText marginleft="-2px">프로필 수정</MenuText>
            </MenuContainer>
            <MenuContainer
              bordercolor={theme.color.border}
              onClick={() => dispatch(showBlockedUsers())}
              $isActive={activeItem === "BlockedUsers"}
            >
              <MediumIcon
                src={process.env.PUBLIC_URL + "/icon/block.svg"}
                filter={theme.filter.font1}
              />
              <MenuText>차단/신고 리스트</MenuText>
            </MenuContainer>
            <MenuContainer bordercolor={theme.color.border} onClick={() => {}}>
              <MediumIcon
                src={process.env.PUBLIC_URL + "/icon/logout.svg"}
                filter={theme.filter.font1}
              />
              <MenuText>로그아웃</MenuText>
            </MenuContainer>
            <MenuContainer
              bordercolor={theme.color.border}
              onClick={() => dispatch(showDeleteAccount())}
              $isActive={activeItem === "DeleteAccount"}
            >
              <MediumIcon
                src={process.env.PUBLIC_URL + "/icon/withdraw.svg"}
                filter={theme.filter.font1}
              />
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
  background-color: ${({ theme }) => theme.color.bg2};
`;

let Body = styled.div`
  display: flex;
  flex-direction: row;
  margin: 0px 196px;
  flex-grow: 1;
  background-color: ${({ theme }) => theme.color.bg};
`;

let MenuLayout = styled.div`
  display: flex;
  flex-direction: column;
  width: 240px;
  border-right: 2px solid ${({ theme }) => theme.color.border};
  background-color: ${({ theme }) => theme.color.bg};
`;

let MenuText = styled.span`
  font-size: 14px;
  margin: ${({ marginleft }) => marginleft};
  color: ${({ theme }) => theme.color.font1};
`;

let MenuContainer = styled.div`
  height: 56px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 16px;
  padding: 0px 24px;
  border-bottom: 1px solid ${({ theme }) => theme.color.border};
  background-color: none;
  cursor: default;

  &:hover {
    background-color: ${({ theme }) => theme.color.bg2};
  }
`;

let MediumIcon = styled.img`
    ${({ theme }) => theme.component.iconSize.medium};
    filter: ${({ filter }) => filter};
`;

export default SettingPage;
