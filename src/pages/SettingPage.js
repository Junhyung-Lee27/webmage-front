import styled, { ThemeProvider } from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { showProfileView, showAccountView, showBlockedUsers } from "./../store/settingpageSlice";
import componentTheme from "./../components/theme";

import Header from "../components/Header";
import ProfileView from "../components/ProfileView";
import AccountView from "../components/AccountView";
import BlockedUsers from "../components/BlockedUsers";
import DeleteAccount from "../components/DeleteAccount";


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
              onClick={() => dispatch(showProfileView())}
              $isActive={activeItem === "ProfileView"}
            >
              <SmallIcon
                src={process.env.PUBLIC_URL + "/icon/manage-profile.svg"}
                filter={theme.filter.font1}
              />
              <MenuText marginleft="-2px">프로필 관리</MenuText>
            </MenuContainer>
            <MenuContainer
              bordercolor={theme.color.border}
              onClick={() => dispatch(showAccountView())}
              $isActive={activeItem === "AccountView"}
            >
              <SmallIcon
                src={process.env.PUBLIC_URL + "/icon/manage-account.svg"}
                filter={theme.filter.font1}
              />
              <MenuText marginleft="-2px">계정 관리</MenuText>
            </MenuContainer>
            <MenuContainer
              bordercolor={theme.color.border}
              onClick={() => dispatch(showBlockedUsers())}
              $isActive={activeItem === "BlockedUsers"}
            >
              <SmallIcon
                src={process.env.PUBLIC_URL + "/icon/blocked-users.svg"}
                filter={theme.filter.font1}
              />
              <MenuText>차단/신고 리스트</MenuText>
            </MenuContainer>
          </MenuLayout>
          {activeItem === "ProfileView" && <ProfileView />}
          {activeItem === "AccountView" && <AccountView />}
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
  width: 216px;
  border-right: 1px solid ${({ theme }) => theme.color.border};
  background-color: ${({ theme }) => theme.color.bg};
`;

let MenuText = styled.span`
  font-size: 14px;
  margin: ${({ marginleft }) => marginleft};
`;

let SmallIcon = styled.img`
  ${({ theme }) => theme.component.iconSize.small};
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

  ${MenuText} {
    color: ${({ $isActive, theme }) => ($isActive ? theme.color.primary : theme.color.font1)};
  }

  ${SmallIcon} {
    filter: ${({ $isActive, theme }) => ($isActive ? theme.filter.primary : theme.filter.font2)};
  }
`;

export default SettingPage;
