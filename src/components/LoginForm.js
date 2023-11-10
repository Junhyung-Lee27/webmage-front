import { useState, useEffect } from "react";
import { login } from "../services/authService";

import styled, { ThemeProvider } from "styled-components";
import componentTheme from "./theme";
import { useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { showSignup, showForgotPassword } from "../store/authpageSlice";
import { setUser, setAuthToken, setIsLoggedIn } from "../store/userSlice";

import axios from "axios";
import { BASE_URL } from "./../config";

function LoginForm() {
  let navigate = useNavigate();
  const dispatch = useDispatch();

  // 테마
  const colorTheme = useSelector((state) => state.theme.themes[state.theme.currentTheme]);
  const filterTheme = useSelector((state) => state.theme.filters[state.theme.currentTheme]);
  const theme = {
    color: colorTheme,
    filter: filterTheme,
    component: componentTheme,
  };

  // 입력값 상태 관리
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleUsernameChange = (e) => setUsername(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  // 일반 로그인
  const handleLoginClick = async () => {
    const loginResponse = await login(username, password);
    if (loginResponse.success && loginResponse.token) {
      // 현재는 편의를 위해 이렇게 로컬스토리지에 저장하지만,
      // 나중에는 보안을 위해 필요할 때 서버에서 불러오는 방식으로 변경되어야 할 필요가 있음!!
      try {
        const userResponse = await axios.get(`${BASE_URL}/user/profile/${loginResponse.userId}`);
        dispatch(
          setUser({
            userId: userResponse.data.user_id,
            username: userResponse.data.username,
            userImg: userResponse.data.user_img,
            position: userResponse.data.user_position,
            info: userResponse.data.user_info,
            hash: userResponse.data.user_hash,
            email: userResponse.data.user_email,
            successCount: userResponse.data.success_count,
          })
        );
      } catch (error) {
        console.error(error);
      }
      dispatch(setAuthToken(loginResponse.token));
      dispatch(setIsLoggedIn(true));
      navigate("/manda");
    } else if (loginResponse.error) {
      alert(loginResponse.error);
    }
  };

  // 카카오 로그인
  async function loginWithKakao() {
    // 사용자 동의 및 클라이언트 authorization code 요청
    const kakaoParams = {
      client_id: `${process.env.REACT_APP_KAKAO_APP_KEY}`,
      redirect_uri: `${process.env.REACT_APP_KAKAO_REDIRECT_URI}`,
      response_type: "code",
    };
    const kParams = new URLSearchParams(kakaoParams).toString();
    const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?${kParams}`;
    window.location.href = KAKAO_AUTH_URL;
  }

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
        <Row margin="16px 0px 0px 0px">
          {/* <LogoWrap backgroundcolor="#FFFFFF" border={`1px solid ${theme.color.border}`}>
            <SocialLogo
              src={process.env.PUBLIC_URL + "/logo/Google_Logo.svg"}
              size="70%"
            ></SocialLogo>
          </LogoWrap> */}
          <LogoWrap onClick={() => loginWithKakao()} backgroundcolor="#FEE500" border="none">
            <SocialLogo
              src={process.env.PUBLIC_URL + "/logo/KaKao_Logo.svg"}
              size="75%"
            ></SocialLogo>
          </LogoWrap>
          {/* <LogoWrap backgroundcolor="#03C75A" border="none">
            <SocialLogo
              src={process.env.PUBLIC_URL + "/logo/Naver_Logo.svg"}
              size="140%"
            ></SocialLogo>
          </LogoWrap> */}
        </Row>
      </Column>
    </ThemeProvider>
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
  margin: 24px 2px 16px 2px;
  color: ${({ color }) => color};
  background-color: ${({ theme }) => theme.color.primary};
  border: 1px solid ${({ theme }) => theme.color.primary};
  border-radius: 8px;
  outline: none;
  cursor: pointer;
`;

let LogoWrap = styled.button`
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

export default LoginForm;
