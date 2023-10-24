import styled, { ThemeProvider } from "styled-components";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import ThemeSwitch from "../components/ThemeSwitch";
import MandaIconUrl from "./../assets/images/Manda_icon.svg";
import {ReactComponent as AccountCircleIcon} from "./../assets/images/AccountCircle.svg";
import {ReactComponent as NotificationsIcon} from "./../assets/images/Notifications.svg";

function Header() {
  const theme = useSelector((state) => state.theme.themes[state.theme.currentTheme]);

  return (
    <ThemeProvider theme={theme}>
      <HeaderLayout position="relative" justifyContent="space-between" padding="0px 196px">
        <Row gap="48px">
          <MandaIcon />
          <Row gap="16px">
            <StyledLink to="/manda" activeClassName="active">
              만다라트
            </StyledLink>
            <StyledLink to="/feed" activeClassName="active">
              피드
            </StyledLink>
            <StyledLink to="/explore" activeClassName="active">
              탐색
            </StyledLink>
            <StyledLink to="/chat" activeClassName="active">
              채팅
            </StyledLink>
          </Row>
        </Row>
        <Row gap="40px">
          <SearchBox type="text" placeholder="검색" id="search-box" />
          <Row gap="24px">
            <StyledNotificationIcon></StyledNotificationIcon>
            <StyledAccountCircleIcon></StyledAccountCircleIcon>
          </Row>
          <ThemeSwitch />
        </Row>
      </HeaderLayout>
    </ThemeProvider>
  );
}

let HeaderLayout = styled.div`
  position: ${({ position }) => position};
  z-index: 1;
  height: 56px;
  padding: ${({ padding }) => padding};
  box-sizing: border-box;
  gap: ${({ gap = "16px" }) => gap};
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: ${({ justifyContent = "center" }) => justifyContent};
  background-color: ${({ theme }) => theme.bg};
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

let Row = styled.div`
  position: ${({ position }) => position};
  height: 56px;
  padding: ${({ padding }) => padding};
  box-sizing: border-box;
  gap: ${({ gap = "16px" }) => gap};
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: ${({ justifyContent = "center" }) => justifyContent};
`;

let MandaIcon = styled.object`
  background-image: url(${MandaIconUrl});
  height: 48px;
  width: 48px;
  background-size: cover;
`;

let StyledLink = styled(NavLink)`
  font-size: 20px;
  line-height: 24px;
  font-weight: 600;
  text-align: center;
  padding: 16px 0px;
  text-decoration: none;
  color: ${({ theme }) => theme.font2};

  &.active {
    color: ${({ theme }) => theme.primary};
  }

  &:hover {
    color: ${({ theme }) => theme.secondary};
  }
`;

let SearchBox = styled.input`
  height: 34px;
  padding: 9px 120px 9px 16px;
  box-sizing: border-box;
  font-size: 16px;
  color: ${({ theme }) => theme.font1};
  background-color: ${({ theme }) => theme.bg2};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 4px;
  &::placeholder {
    color: ${({ theme }) => theme.font2};
    opacity: 0.5;
  }
  &:focus {
    outline: 1px solid ${({ theme }) => theme.primary};
  }
`;

let StyledNotificationIcon = styled(NotificationsIcon)`
  width: 36px;
  height: 36px;
  fill: ${({ theme }) => theme.font2};
`;

let StyledAccountCircleIcon = styled(AccountCircleIcon)`
  width: 36px;
  height: 36px;
  fill: ${({ theme }) => theme.font2};
`;

export default Header;
