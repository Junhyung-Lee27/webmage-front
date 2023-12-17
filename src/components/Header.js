import styled, { ThemeProvider } from "styled-components";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import componentTheme from "./theme";
import ThemeSwitch from "../components/ThemeSwitch";
import Notification from "./Notification";

import { logout } from "../services/authService";
import { setIsLoggedIn, resetUserState, setUser } from "../store/userSlice";
import { setSearchResults, clearSearchResults } from "../store/searchSlice";
import { BASE_URL } from "./../config";
import { WS_BASE_URL } from "./../config";

import axios from "axios";
import { resetMandaState } from "../store/mandaSlice";
import { persistor } from "../store/store";
import { setSelectedUser } from "../store/selectedUserSlice";

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

  // 상태 관리
  const user = useSelector((state) => state.user);
  const [notifications, setNotifications] = useState([]);
  const [isNotiVisible, setIsNotiVisible] = useState(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // 초기 notifications 불러오기
  useEffect(() => {
    getNotifications(user.userId);
  }, [user.userId]);

  async function getNotifications(userId) {
    try {
      const response = await axios.get(`${BASE_URL}/noti/get/${userId}`, {
        headers: {
          Authorization: `Token ${authToken}`,
        },
      });
      if (response.status === 200) {
        setNotifications(response.data);
      }
    } catch (error) {
      console.log("알림 조회 중 오류 발생: ", error);
    }
  }

  // notification의 is_read 상태 업데이트
  useEffect(() => {
    const unread = notifications.some((notification) => notification.is_read === false);
    setHasUnreadNotifications(unread);
  }, [notifications]);

  // WebSocket
  useEffect(() => {
    const client = new WebSocket(
      `${WS_BASE_URL}/ws/notifications/${user.userId}/?token=${user.authToken}`
    );

    client.onopen = () => {
      console.log("WebSocket Client Connected");
    };

    client.onmessage = (message) => {
      const data = JSON.parse(message.data);
      if (data.type === "follow" || "comment" || "reaction") {
        setNotifications((prevNotifications) => [data, ...prevNotifications]);
      }
    };

    client.onerror = (error) => {
      console.error(`WebSocket error: ${error.message}`);
    };

    client.onclose = () => {
      console.log("WebSocket Client Disconnected");
    };

    return () => client.close();
  }, [user.userId, user.authToken]);

  // 로그아웃 요청
  const handleLogoutClick = async () => {
    const response = await logout();
    if (response.success) {
      // 상태 초기화
      await persistor.purge();
      dispatch(
        setUser({
          userId: "",
          username: "",
          userImg: "",
          userPosition: "",
          userInfo: "",
          userHash: "",
          followerCount: 0,
          successCount: 0,
        })
      );
      dispatch(setSelectedUser({})); // 선택된 유저 초기화
      dispatch(setIsLoggedIn(false)); // 로그인 여부 false
      dispatch(resetMandaState()); // 만다 상태 초기화

      // 로그인 화면 이동
      navigate("/");
    } else if (response.error) {
      alert(response.error);
    }
  };

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // get authToken
  const authToken = useSelector((state) => state.user.authToken);

  // 검색 요청
  const handleSearch = async (event, searchTerm) => {
    // Enter 키의 keyCode는 13입니다.
    if (event.key === "Enter") {
      if (!searchTerm.trim()) {
        alert('검색어를 입력해주세요');
        return
      }

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
            query: searchTerm,
          },
        });
        if (response.status === 200) {
          dispatch(setSearchResults(response.data));
        }
      } catch (error) {
        console.error("검색 중 오류 발생:", error);
      }
    }
  };

  return (
    <ThemeProvider theme={combinedTheme}>
      <FixedHeader>
        <HeaderLayout>
          <Stadardized>
            <Row gap="48px" width="fit-content">
              <NavLink
                onClick={() => {
                  dispatch(setSelectedUser(user));
                }}
                to="/manda"
              >
                <MandaIcon
                  src={process.env.PUBLIC_URL + "/logo/Manda_logo2.svg"}
                  alt="Manda Logo"
                />
              </NavLink>
              <Row gap="16px">
                <StyledLink
                  onClick={() => {
                    dispatch(setSelectedUser(user));
                  }}
                  to="/manda"
                  activeclassname="active"
                >
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
                {/* <StyledLink to="/chat" activeclassname="active">
                  채팅
                </StyledLink> */}
              </Row>
            </Row>
            <Row gap="20px" flex="1" justifycontent="flex-end">
              <SearchBox
                type="text"
                placeholder="만다라트 목표, 사용자 이름, 게시물로 검색하세요"
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
                  {hasUnreadNotifications && <NewNotificationDot />}
                  {isNotiVisible && (
                    <Notification notifications={notifications} setNotifications={setNotifications}>
                      ...
                    </Notification>
                  )}
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
  flex: ${({ flex }) => flex};
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

let NavToMain = styled.div``;

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
  flex: 1;
  margin: 0px 40px 0px 60px;
  height: 34px;
  padding: 9px 16px;
  box-sizing: border-box;
  font-size: 14px;
  color: ${({ theme }) => theme.color.font1};
  text-align: center;
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
    background-color: ${({ theme }) => theme.color.bg3};
  }
`;

let NewNotificationDot = styled.div`
  background-color: ${({ theme }) => theme.color.primary};
  width: 12px;
  height: 12px;
  border-radius: 100%;
  border: 2px solid ${({ theme }) => theme.color.bg};
  position: absolute;
  right: 0px;
  top: 0px;
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
