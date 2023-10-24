import styled from "styled-components";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import ThemeSwitch from "../components/ThemeSwitch";
import MandaIconUrl from "./../assets/images/Manda_icon.svg";
import {ReactComponent as AccountCircleIcon} from "./../assets/images/AccountCircle.svg";
import {ReactComponent as NotificationsIcon} from "./../assets/images/Notifications.svg";

function Header() {
  const currentTheme = useSelector((state) => state.theme.themes[state.theme.currentTheme]);

  return (
    <Row
      backgroundColor={currentTheme.bg}
      justifyContent="space-between"
      padding="0px 196px"
      boxShadow="0px 4px 4px 0px #00000025"
    >
      <Row gap="48px">
        <MandaIcon />
        <Row gap="16px">
          <StyledLink theme={currentTheme} to="/manda" activeClassName="active">
            만다라트
          </StyledLink>
          <StyledLink theme={currentTheme} to="/feed" activeClassName="active">
            피드
          </StyledLink>
          <StyledLink theme={currentTheme} to="/explore" activeClassName="active">
            탐색
          </StyledLink>
          <StyledLink theme={currentTheme} to="/chat" activeClassName="active">
            채팅
          </StyledLink>
        </Row>
      </Row>
      <Row gap="40px">
        <SearchBox
          type="text"
          placeholder="검색"
          id="search-box"
          fontColor={currentTheme.font1}
          placeholderColor={currentTheme.font2}
          backgroundColor={currentTheme.bg2}
          borderColor={currentTheme.border}
          outlineColor={currentTheme.primary}
        />
        <Row gap="24px">
          <StyledNotificationIcon fill={currentTheme.font2}></StyledNotificationIcon>
          <StyledAccountCircleIcon fill={currentTheme.font2}></StyledAccountCircleIcon>
        </Row>
        <ThemeSwitch />
      </Row>
    </Row>
  );
}

let Row = styled.div`
  height: 56px;
  padding: ${({ padding }) => padding};
  box-shadow: ${({ boxShadow = "none"}) => boxShadow};
  box-sizing: border-box;
  gap: ${({ gap = "16px" }) => gap};
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: ${({ justifyContent = "center" }) => justifyContent};
  background-color: ${({ backgroundColor }) => backgroundColor};
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
  color: ${({ fontColor }) => fontColor};
  background-color: ${({ backgroundColor }) => backgroundColor};
  border: 1px solid ${({ borderColor }) => borderColor};
  border-radius: 4px;
  &::placeholder {
    color: ${({ placeholderColor }) => placeholderColor};
    opacity: 0.5;
  }
  &:focus {
    outline: 1px solid ${({ outlineColor }) => outlineColor};
  }
`;

let StyledNotificationIcon = styled(NotificationsIcon)`
  width: 36px;
  height: 36px;
  fill: ${({ fillColor }) => fillColor};
`;

let StyledAccountCircleIcon = styled(AccountCircleIcon)`
  width: 36px;
  height: 36px;
  fill: ${({ fillColor }) => fillColor};
`;

export default Header;
