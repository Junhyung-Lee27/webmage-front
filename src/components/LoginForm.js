import { useState } from "react";
import { login, getToken } from "../services/authService";

import styled, { ThemeProvider } from "styled-components";
import componentTheme from "./theme";
import { useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { showSignup, showForgotPassword } from "../store/authpageSlice";
import { setUser, setToken, setIsLoggedIn } from '../store/userSlice';

function LoginForm() {
  const loggedin = useSelector((state) => state.user.isLoggedIn);
  console.log(loggedin);
  
    let navigate = useNavigate();
  const dispatch = useDispatch();

  // 입력값 상태 관리
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleUsernameChange = (e) => setUsername(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  // 토큰 요청
  const handleGetToken = async () => {
    const response = await getToken();
    if (response.success) {
      let token = response.token;
      dispatch(setToken(token));
    } else if (response.error) {
      alert(response.error);
    }
  };

  // 로그인 요청
  const handleLoginClick = async () => {
    const response = await login(username, password);
    if (response.success) {
      dispatch(setUser({username:username}));
      dispatch(setIsLoggedIn(true))
      navigate("/manda");
      handleGetToken(); // 토큰 저장
    } else if (response.error) {
      alert(response.error);
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
        <Column>
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
        </Column>
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

export default LoginForm;
