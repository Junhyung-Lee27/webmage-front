import styled, { ThemeProvider } from "styled-components";
import { useSelector } from "react-redux";
import Header from "../components/Header";
import { ReactComponent as UserEditIcon } from "./../assets/images/UserEdit.svg";
import { ReactComponent as UserXIcon } from "./../assets/images/UserX.svg";
import { ReactComponent as UserDeleteIcon } from "./../assets/images/UserDelete.svg";

function SettingPage() {
  const theme = useSelector((state) => state.theme.themes[state.theme.currentTheme]);

  return (
    <ThemeProvider theme={theme}>
      <PageLayout >
        <Header></Header>
        <Body >
          <MenuLayout >
            <MenuContainer >
              <StyledUserEditIcon  />
              <MenuText  marginleft="-2px">프로필 수정</MenuText>
            </MenuContainer>
            <MenuContainer bordercolor={theme.border}>
              <StyledUserXIcon  />
              <MenuText >차단/신고 리스트</MenuText>
            </MenuContainer>
            <MenuContainer bordercolor={theme.border}>
              <StyledUserDeleteIcon  />
              <MenuText >회원탈퇴</MenuText>
            </MenuContainer>
          </MenuLayout>
          <div>본문</div>
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

let MenuContainer = styled.div`
  height: 56px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 16px;
  padding: 0px 24px;
  border-bottom: 1px solid ${({ theme }) => theme.border};

  &:hover {
    color: ${({ theme }) => theme.secondary};
    fill: ${({ theme }) => theme.secondary};
  }
`;

let MenuText = styled.span`
  font-size: 14px;
  margin: ${({ marginleft }) => marginleft};
  color: ${({ theme }) => theme.font1};
`

let StyledUserEditIcon = styled(UserEditIcon)`
  fill: ${({ theme }) => theme.font2};
  margin-left: 4px;
`;

let StyledUserXIcon = styled(UserXIcon)`
  fill: ${({ theme }) => theme.font2};
`;

let StyledUserDeleteIcon = styled(UserDeleteIcon)`
  fill: ${({ theme }) => theme.font2};
`;

export default SettingPage;
