import styled, { ThemeProvider } from "styled-components";
import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import componentTheme from "./theme";
import ThemeSwitch from "../components/ThemeSwitch";
import Notification from "./Notification";

import { logout } from "../services/authService";
import { setIsLoggedIn, resetUserState, setUser } from "../store/userSlice";
import { setSearchedKeyword } from "../store/searchSlice";
import { BASE_URL } from "./../config";
import { WS_BASE_URL } from "./../config";

import axios from "axios";
import { resetMandaState } from "../store/mandaSlice";
import { persistor } from "../store/store";
import { setSelectedUser } from "../store/selectedUserSlice";

const Header = React.forwardRef((props, ref) => {
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
  const [isMounted, setIsMounted] = useState(true);

  // 마운트 설정
  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);

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
      if (response.status === 200 && isMounted) {
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
      if (data.type === "follow" || data.type === "comment" || data.type === "reaction") {
        setNotifications((prevNotifications) => [data, ...prevNotifications]);
      }
    };

    client.onerror = (error) => {
      console.error(`WebSocket error: ${error.message}`);
    };

    client.onclose = () => {
      console.log("WebSocket Client Disconnected");
    };

    return () => {
      if (client.readyState === WebSocket.OPEN) {
        client.close();
      }
    };
  }, [user.userId, user.authToken]);

  // NotiIconWrapper를 위한 ref
  const notiIconRef = useRef(null);

  // NotiIconWrapper 외부 클릭 감지 핸들러
  useEffect(() => {
    function handleClickOutside(event) {
      if (notiIconRef.current && !notiIconRef.current.contains(event.target)) {
        setIsNotiVisible(false);
      }
    }

    // 이벤트 리스너 등록
    document.addEventListener("mousedown", handleClickOutside);

    // 클린업 함수
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [notiIconRef]);

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

  // 검색창 동작
  const handleSearch = async (event) => {
    if (event.key === "Enter") {
      if (!searchTerm.trim()) {
        alert("검색어를 입력해주세요");
        return;
      }

      // 검색 키워드 상태 저장
      dispatch(setSearchedKeyword(searchTerm));

      // 검색 페이지 이동
      navigate(`/search/${searchTerm}`);
    }
  };

  return (
    <ThemeProvider theme={combinedTheme}>
      <FixedHeader ref={ref}>
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
              <Row gap="8px">
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
              <SearchBox
                type="text"
                placeholder="만다라트, 사용자, 게시물 내용으로 검색하기"
                id="search-box"
                value={searchTerm}
                onChange={handleInputChange}
                onKeyDown={handleSearch}
              />
            </Row>
            <Row gap="20px" flex="1" justifycontent="flex-end">
              <Row gap="16px">
                <IconLink to="/setting" activeclassname="active">
                  <LargeIcon src={process.env.PUBLIC_URL + "/icon/header/AccountCircle.svg"} />
                  <IconText>프로필·계정</IconText>
                </IconLink>
                <NotiIconWrapper ref={notiIconRef}>
                  <LargeIcon
                    $active={isNotiVisible}
                    onClick={() => {
                      setIsNotiVisible((prevState) => !prevState);
                    }}
                    src={process.env.PUBLIC_URL + "/icon/header/Notifications.svg"}
                  />
                  {hasUnreadNotifications && <NewNotificationDot />}
                  {isNotiVisible && (
                    <Notification
                      notifications={notifications}
                      setNotifications={setNotifications}
                    ></Notification>
                  )}
                  <IconText>알림</IconText>
                </NotiIconWrapper>
                {/* <LogoutBtn>로그아웃</LogoutBtn> */}
                <IconWrapper>
                  <LargeIcon
                    padding="4px 4px 4px 6px"
                    src={process.env.PUBLIC_URL + "/icon/header/Logout.svg"}
                    onClick={handleLogoutClick}
                  />
                  <IconText>로그아웃</IconText>
                </IconWrapper>
              </Row>
              {/* <ThemeSwitch /> */}
            </Row>
          </Stadardized>
        </HeaderLayout>
      </FixedHeader>
    </ThemeProvider>
  );
});

let FixedHeader = styled.div`
  position: fixed;
  z-index: 10;
  ${({ theme }) => theme.component.font.importPretendard};
  font-family: Pretendard-Regular;
  height: 64px;
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
  position: relative;
  
  display: flex;
  justify-content: space-between;
  width: 1280px;
  margin-left: auto;
  margin-right: auto;
`;

let Row = styled.div`
  position: ${({ position }) => position};
  flex: ${({ flex }) => flex};
  height: 64px;
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
  padding: 8px;
  border-radius: 8px;
  text-decoration: none;
  color: ${({ theme }) => theme.color.font2};

  &.active {
    color: ${({ theme }) => theme.color.primary};
  }

  &:hover {
    transition: 0.3s;
    background-color: ${({ theme }) => theme.color.bg3};
  }
`;

let SearchBox = styled.input`
  position: absolute;
  left: 50%;
  transform:translateX(-50%);
  
  width: 400px;
  height: 34px;
  padding: 11px 16px;
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
  padding: ${({ padding = "4px" }) => padding};
  filter: ${({ theme, $active }) => ($active ? theme.filter.primary : theme.filter.font2)};
  cursor: pointer;
`;

let IconText = styled.span`
  position: absolute;
  bottom: -28px; // 조정: 위치 조정
  left: 50%;
  transform: translateX(-50%);
  display: none; // 초기 상태: 숨김
  white-space: nowrap;

  color: ${({ theme }) => theme.color.font1};
  font-size: 14px;
  padding: 4px 8px;
  background-color: ${({ theme }) => theme.color.bg3};
  border-radius: 4px;
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

  position: relative;
  display: inline-block;
  
  &:hover ${IconText} {
    display: block;
  }
`;

let IconWrapper = styled.div`
  ${({ theme }) => theme.component.iconSize.large};
  border-radius: 50%;
  border: none;

  &:hover {
    background-color: ${({ theme }) => theme.color.bg3};
  }

  position: relative;
  display: inline-block;
  
  &:hover ${IconText} {
    display: block;
  }
`;

let NotiIconWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;

  &:hover {
    transition: 0.3s;
    background-color: ${({ theme }) => theme.color.bg3};
  }

  position: relative;
  display: inline-block;

  &:hover ${IconText} {
    display: block;
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
    color: ${({ theme }) => theme.color.primary};
    border: 1px solid ${({ theme }) => theme.color.primary};
  }
`;

export default Header;
