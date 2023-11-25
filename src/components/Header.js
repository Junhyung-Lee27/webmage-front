import styled, { ThemeProvider } from "styled-components";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import componentTheme from "./theme";
import ThemeSwitch from "../components/ThemeSwitch";
import Notification from "./Notification";

import { logout } from "../services/authService";
import { setIsLoggedIn, resetUserState } from "../store/userSlice";
import { setSearchResults, clearSearchResults } from "../store/searchSlice";
import { BASE_URL } from "./../config";

import axios from "axios";
import { resetMandaState } from "../store/mandaSlice";
import { persistor } from "../store/store";

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

  // 알림 컴포넌트 상태관리
  const [isNotiVisible, setIsNotiVisible] = useState(false);

  // 로그아웃 요청
  const handleLogoutClick = async () => {
    const response = await logout();
    if (response.success) {
      await persistor.purge();

      dispatch(setIsLoggedIn(false)); // 로그인 여부 false
      dispatch(resetUserState()); // 유저 상태 초기화
      dispatch(resetMandaState()); // 만다 상태 초기화

      // 로그인 화면 이동
      navigate("/");
    } else if (response.error) {
      alert(response.error);
    }
  };

  // 검색어 상태
  const [searchTerm, setSearchTerm] = useState("");

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // get authToken
  const authToken = useSelector((state) => state.user.authToken);
  
  // 서버에 검색 요청
  const handleSearch = async (event, isNavLink = false) => {
    let queryTerm = isNavLink ? "" : searchTerm;
    
    // Enter 키의 keyCode는 13입니다.
    if (event.key === "Enter" || isNavLink) {
      if (queryTerm.trim() || isNavLink) {
      // '/search' 페이지가 아닌 경우 이동
      if (window.location.pathname !== "/search") {
        navigate("/search");
      }

      try {
        const response = await axios.get(`${BASE_URL}/search`, {
          headers: {
            Authorization: `Token ${authToken}`, // 헤더에 토큰 추가
          },
          params: {
            query: queryTerm,
          },
        });
        dispatch(setSearchResults(response.data));
      } catch (error) {
        console.error("검색 중 오류 발생:", error);
      }
    }
  };
}

  return (
    <ThemeProvider theme={combinedTheme}>
      <FixedHeader>
        <HeaderLayout>
          <Stadardized>
            <Row gap="48px">
              <NavLink to="/manda">
                <MandaIcon
                  src={process.env.PUBLIC_URL + "/logo/Manda_logo2.svg"}
                  alt="Manda Logo"
                />
              </NavLink>
              <Row gap="16px">
                <StyledLink to="/manda" activeclassname="active">
                  만다라트
                </StyledLink>
                <StyledLink to="/feed" activeclassname="active">
                  피드
                </StyledLink>
                {/* <StyledLink
                to="/search"
                activeclassname="active"
                onClick={(e) => {
                  // 이벤트 버블링을 방지하여 NavLink의 기본 동작에 방해되지 않게 합니다.
                  e.stopPropagation();
                  handleSearch(e, true);
                }}
              >
                탐색
              </StyledLink> */}
                <StyledLink to="/chat" activeclassname="active">
                  채팅
                </StyledLink>
              </Row>
            </Row>
            <Row gap="20px">
              <SearchBox
                type="text"
                placeholder="검색"
                id="search-box"
                value={searchTerm}
                onChange={handleInputChange}
                onKeyDown={handleSearch}
              />
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
          </Stadardized>
        </HeaderLayout>
      </FixedHeader>
    </ThemeProvider>
  );
}

let FixedHeader = styled.div`
  position: fixed;
  z-index: 10;
  ${({ theme }) => theme.component.font.importPretendard};
  font-family: Pretendard-Regular;
  height: 56px;
  width: 100%;
  box-sizing: border-box;
  background-color: ${({ theme }) => theme.color.bg};
`;

let HeaderLayout = styled.div`
  position: relative;
  gap: ${({ gap = "16px" }) => gap};
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: ${({ justifycontent = "center" }) => justifycontent};
  border-bottom: 1px solid ${({ theme }) => theme.color.border};
`;

let Stadardized = styled.div`
  display: flex;
  justify-content: space-between;
  width: 1080px;
  margin-left: auto;
  margin-right: auto;
`;

let Row = styled.div`
  position: ${({ position }) => position};
  height: 56px;
  width: ${({ width }) => width};
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
  font-size: 16px;
  line-height: 16px;
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
  padding: 9px 40px 9px 16px;
  box-sizing: border-box;
  font-size: 14px;
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
  padding: 2px;
  filter: ${({ theme, $active }) => ($active ? theme.filter.primary : theme.filter.font2)};
  cursor: pointer;
`;

let IconLink = styled(NavLink)`
  ${({ theme }) => theme.component.iconSize.large};

  border-radius: 50%;
  border: none;

  &.active ${LargeIcon} {
    filter: ${({ theme }) => theme.filter.primary};
  }

  &:hover {
    background-color: ${({ theme }) => theme.color.bg3};
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
  width: 88px;
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
