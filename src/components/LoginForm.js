import { useState } from "react";
import { getCsrfToken, login } from "../services/authService";

import styled, { ThemeProvider } from "styled-components";
import componentTheme from "./theme";
import { useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { showSignup, showForgotPassword } from "../store/authpageSlice";
import { setUser, setAuthToken, setCsrfToken, setIsLoggedIn } from "../store/userSlice";

import { setCookie } from "../services/cookie";
import axios from "axios";

function LoginForm() {
  let navigate = useNavigate();
  const dispatch = useDispatch();

  // 입력값 상태 관리
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleUsernameChange = (e) => setUsername(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  // 로그인 요청
  const handleLoginClick = async () => {
    // csrf token
    const csrfTokenResponse = await getCsrfToken();

    if (csrfTokenResponse.success && csrfTokenResponse.csrfToken) {
      const csrfToken = csrfTokenResponse.csrfToken;

      dispatch(setCsrfToken(csrfToken));

      // 쿠키에 저장
      setCookie("csrftoken", csrfToken, {
        path: "/",
      });
    } else if (csrfTokenResponse.error) {
      alert(csrfTokenResponse.error);
    }

    const loginResponse = await login(username, password);
    if (loginResponse.success && loginResponse.token) {
      // 현재는 편의를 위해 이렇게 로컬스토리지에 저장하지만,
      // 나중에는 보안을 위해 필요할 때 서버에서 불러오는 방식으로 변경되어야 할 필요가 있음!!
      try {
        const userResponse = await axios.get(
          `http://127.0.0.1:8000/user/profile/${loginResponse.userId}`
        );
        dispatch(
          setUser({
            userId: userResponse.user_id,
            username: userResponse.username,
            userImg: userResponse.user_img,
            position: userResponse.user_position,
            info: userResponse.user_info,
            hash: userResponse.user_hash,
            email: userResponse.user_email,
          })
        );
      } catch (error) {
        console.error(error);
      }
      dispatch(setAuthToken(loginResponse.token));
      dispatch(setIsLoggedIn(true));
    } else if (loginResponse.error) {
      alert(loginResponse.error);
    }
  };

  // 테마
  const colorTheme = useSelector((state) => state.theme.themes[state.theme.currentTheme]);
  const filterTheme = useSelector((state) => state.theme.filters[state.theme.currentTheme]);
  const theme = {
    color: colorTheme,
    filter: filterTheme,
    component: componentTheme,
  };

  // 소셜 로그인 모달
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <ThemeProvider theme={theme}>
      <Column>
        <StyledText color={theme.color.font1} size="14" weight="600" margin="24px 0px 0px 0px">
          <label htmlFor="username">아이디</label>
        </StyledText>
        <StyledForm
          type="username"
          placeholder="아이디를 입력해주세요"
          id="username"
          value={username}
          onChange={handleUsernameChange}
        ></StyledForm>
        <StyledText color={theme.color.font1} size="14" weight="600" margin="16px 0px 0px 0px">
          <label htmlFor="password">비밀번호</label>
        </StyledText>
        <StyledForm
          type="password"
          placeholder="비밀번호를 입력해주세요"
          id="password"
          value={password}
          onChange={handlePasswordChange}
        ></StyledForm>
        <StyledButton color="white" onClick={handleLoginClick}>
          로그인
        </StyledButton>
        <Row>
          <StyledText
            size="12"
            weight="700"
            align="center"
            color={theme.color.font2}
            cursor="pointer"
            onClick={() => {
              dispatch(showSignup());
            }}
          >
            회원가입
          </StyledText>
          <StyledText
            size="12"
            weight="700"
            align="center"
            color={theme.color.font2}
            cursor="pointer"
            onClick={() => {
              dispatch(showForgotPassword());
            }}
          >
            비밀번호 찾기
          </StyledText>
        </Row>
        <LineText>간편 로그인</LineText>
        <NotyetContainer onClick={() => setIsModalOpen(true)}>
          <Row margin="16px 0px 0px 0px">
            <LogoWrap backgroundcolor="#FFFFFF" border={`1px solid ${theme.color.font2}`}>
              <SocialLogo
                src={process.env.PUBLIC_URL + "/logo/Google_Logo.svg"}
                size="55%"
              ></SocialLogo>
            </LogoWrap>
            <LogoWrap backgroundcolor="#FEE500" border="none">
              <SocialLogo
                src={process.env.PUBLIC_URL + "/logo/KaKao_Logo.svg"}
                size="55%"
              ></SocialLogo>
            </LogoWrap>
            <LogoWrap backgroundcolor="#03C75A" border="none">
              <SocialLogo
                src={process.env.PUBLIC_URL + "/logo/Naver_Logo.svg"}
                size="100%"
              ></SocialLogo>
            </LogoWrap>
          </Row>
        </NotyetContainer>
      </Column>
      {isModalOpen === true && (
        <SocialLogin theme={theme} setIsModalOpen={setIsModalOpen}></SocialLogin>
      )}
    </ThemeProvider>
  );
}

function SocialLogin({ theme, setIsModalOpen }) {
  return (
    <ModalOverlay>
      <ModalContent>
        <ModalTitle>🚧편리한 서비스 이용을 위해 간편 로그인 기능을 준비중입니다🚧</ModalTitle>
        <ModifiedBtn
          color={theme.color.font1}
          backgroundcolor={theme.color.bg3}
          border="none"
          onClick={() => setIsModalOpen(false)}
        >
          확인
        </ModifiedBtn>
      </ModalContent>
    </ModalOverlay>
  );
}

let Column = styled.div`
  display: flex;
  flex-direction: column;
`;

let Row = styled.div`
  display: flex;
  flex-direction: Row;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin: ${({ margin }) => margin};
`;

let StyledText = styled.span`
  font-size: ${({ size }) => size + "px"};
  font-weight: ${({ weight }) => weight};
  color: ${({ color }) => color};
  text-align: ${({ align }) => align};
  margin: ${({ margin }) => margin};
  cursor: ${({ cursor = "default" }) => cursor};
`;

let StyledForm = styled.input`
  box-sizing: content-box;
  height: 24px;
  padding: 8px 16px;
  font-size: 14px;
  color: ${({ theme }) => theme.color.font1};
  border: none;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.color.bg2};
  margin-top: 4px;
  &::placeholder {
    color: ${({ theme }) => theme.color.font2};
    opacity: 0.5;
  }
  &:focus {
    outline: 2px solid ${({ theme }) => theme.color.primary};
  }
`;

let StyledButton = styled.button`
  height: 42px;
  font-size: 16px;
  font-weight: 700;
  line-height: 20px;
  margin: 24px 2px 8px 2px;
  color: ${({ color }) => color};
  background-color: ${({ theme }) => theme.color.primary};
  border: 1px solid ${({ theme }) => theme.color.primary};
  border-radius: 8px;
  outline: none;
  cursor: pointer;
`;

let ModifiedBtn = styled(StyledButton)`
  width: 100%;
  color: white;
  margin: initial;
`;

let LogoWrap = styled.div`
  ${({ theme }) => theme.component.iconSize.large};
  border-radius: 50%;
  background-color: ${({ backgroundcolor }) => backgroundcolor};
  color: ${({ color }) => color};
  border: ${({ border }) => border};
  outline: none;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

let SocialLogo = styled.img`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
`;

const LineText = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.color.font2};
  display: flex;
  align-items: center;
  text-align: center;
  margin: 24px 0px 0px 0px;
  cursor: default;

  &:before,
  &:after {
    content: "";
    flex: 1;
    border-bottom: 1px solid ${({ theme }) => theme.color.border};
  }

  &:before {
    margin-right: 0.5em;
  }

  &:after {
    margin-left: 0.5em;
  }
`;

let NotyetContainer = styled.div`
  width: 100%;
  cursor: pointer;
`;

let ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7); /* 검정색 배경에 70% 투명도 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

let ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  background-color: ${({ theme }) => theme.color.bg};
  padding: 56px 80px;
  border-radius: 8px;
  width: 808px;
  max-height: 100%;
`;

let ModalTitle = styled.span`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.color.font1};
  margin-bottom: 40px;
  text-align: center;
  width: 100%;
`;

export default LoginForm;
