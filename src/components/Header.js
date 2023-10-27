import styled, { ThemeProvider } from "styled-components";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import componentTheme from "./theme";
import ThemeSwitch from "../components/ThemeSwitch";
import Notification from "./notification";

import { logout } from "../services/authService";
import { userStateInit } from "../store/userSlice";
import { useNavigate } from "react-router-dom";

function Header() {
  let navigate = useNavigate();
  let dispatch = useDispatch();

  // 테마
  const colorTheme = useSelector((state) => state.theme.themes[state.theme.currentTheme]);
  const filterTheme = useSelector((state) => state.theme.filters[state.theme.currentTheme]);
  const combinedTheme = {
    color: colorTheme,
    filter: filterTheme,
    component: componentTheme,
  };

  // 상태관리
  const [isNotiVisible, setIsNotiVisible] = useState(false);

  // 로그아웃 요청
  const handleLogoutClick = async () => {
    const response = await logout();
    if (response.success) {
      dispatch(userStateInit())
        navigate("/");
    } else if (response.error) {
      alert(response.error);
    }
  };

  return (
    <ThemeProvider theme={combinedTheme}>
      <HeaderLayout position="relative" justifycontent="space-between" padding="0px 196px">
        <Row gap="48px">
          <NavLink to="/manda">
            <MandaIcon src={process.env.PUBLIC_URL + "/logo/Manda_logo2.svg"} alt="Manda Logo" />
          </NavLink>
          <Row gap="16px">
            <StyledLink to="/manda" activeclassname="active">
              만다라트
            </StyledLink>
            <StyledLink to="/feed" activeclassname="active">
              피드
            </StyledLink>
            <StyledLink to="/search" activeclassname="active">
              탐색
            </StyledLink>
            <StyledLink to="/chat" activeclassname="active">
              채팅
            </StyledLink>
          </Row>
        </Row>
        <Row gap="20px">
          <SearchBox type="text" placeholder="검색" id="search-box" />
          <Row gap="16px">
            <NotiIconWrapper>
              <LargeIcon
                $active={isNotiVisible}
                onClick={() => {
                  setIsNotiVisible((prevState) => !prevState);
                }}
                src={process.env.PUBLIC_URL + "/icon/header/Notifications.svg"}
              />
              {isNotiVisible && <Notification>...</Notification>}
            </NotiIconWrapper>
            <IconLink to="/setting" activeclassname="active">
              <LargeIcon src={process.env.PUBLIC_URL + "/icon/header/AccountCircle.svg"} />
            </IconLink>
            <LogoutBtn onClick={handleLogoutClick}>로그아웃</LogoutBtn>
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
  justify-content: ${({ justifycontent = "center" }) => justifycontent};
  background-color: ${({ theme }) => theme.color.bg};
  border-bottom: 1px solid ${({ theme }) => theme.color.border};
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
  justify-content: ${({ justifycontent = "center" }) => justifycontent};
`;

let MandaIcon = styled.img`
  height: 48px;
  width: 160px;
`;

let StyledLink = styled(NavLink)`
  font-size: 20px;
  line-height: 24px;
  font-weight: 600;
  text-align: center;
  padding: 16px 0px;
  text-decoration: none;
  color: ${({ theme }) => theme.color.font2};

  &.active {
    color: ${({ theme }) => theme.color.primary};
  }

  &:hover {
    color: ${({ theme }) => theme.color.secondary};
  }
`;

let SearchBox = styled.input`
  height: 34px;
  padding: 9px 120px 9px 16px;
  box-sizing: border-box;
  font-size: 16px;
  color: ${({ theme }) => theme.color.font1};
  background-color: ${({ theme }) => theme.color.bg2};
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: 4px;
  &::placeholder {
    color: ${({ theme }) => theme.color.font2};
    opacity: 0.5;
  }
  &:focus {
    outline: 1px solid ${({ theme }) => theme.color.primary};
  }
`;

let LargeIcon = styled.img`
  ${({ theme }) => theme.component.iconSize.large};
  filter: ${({ theme, $active }) => ($active ? theme.filter.primary : theme.filter.font2)};
  margin: 2px;
  cursor: pointer;
`;

let IconLink = styled(NavLink)`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;

  &.active ${LargeIcon} {
    filter: ${({ theme }) => theme.filter.primary};
  }

  &:hover {
    background-color: ${({ theme }) => theme.color.bg3}
  }
`;

let NotiIconWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;

  &:hover {
    background-color: ${({ theme }) => theme.color.bg3}
  }
`;

let LogoutBtn = styled.button`
  width: 80px;
  height: 34px;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.color.font2};
  border: 1px solid ${({ theme }) => theme.color.font2};
  border-radius: 4px;
  background-color: ${({ theme }) => theme.color.bg};
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.color.secondary};
    border: 1px solid ${({ theme }) => theme.color.secondary};
  }
`;

export default Header;
