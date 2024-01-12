import { useState } from "react";
import styled, { ThemeProvider } from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { showLogin } from "../store/authpageSlice";
import { useNavigate } from "react-router-dom";
import { signup, login } from "../services/authService";
import { setIsLoggedIn, setUser, setAuthToken } from "../store/userSlice";
import axios from "axios";
import { BASE_URL } from "./../config";

function SignupForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 입력값 상태 관리
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");

  const handleInputChange = (e, setState) => {
    setState(e.target.value);
  };

  // 회원가입 요청
  const handleSignupClick = async () => {
    const provider = "EMAIL"
    
    const signupResponse = await signup(username, email, password, passwordCheck, provider);

    // 회원가입 성공했을 경우
    if (signupResponse.success) {
      // 로그인 시도
      const loginResponse = await login(username, password, "EMAIL");
      
      if (loginResponse.success) {
        dispatch(setUser({ userId: loginResponse.userId }));
        dispatch(setAuthToken(loginResponse.token));
        dispatch(setIsLoggedIn(true));
        window.location.reload(); // 페이지 리로드
        navigate("/manda");
      } else if (loginResponse.error) {
        alert("로그인에 실패했습니다. 잠시 후 다시 시도해주세요.");
      }
    }
    // 회원가입 실패했을 경우
    else if (signupResponse.error) {
      alert(signupResponse.error);
    }
  };

  // 테마
  const theme = useSelector((state) => state.theme.themes[state.theme.currentTheme]);

  // UI
  return (
    <ThemeProvider theme={theme}>
      <Column>
        <Column>
          <StyledText color={theme.font1}>
            <label htmlFor="username">사용자 이름</label>
          </StyledText>
          <StyledForm
            type="text"
            placeholder="6-12자의 한글, 영문, 숫자, -, _만 가능합니다."
            id="username"
            value={username}
            onChange={(e) => handleInputChange(e, setUsername)}
          ></StyledForm>

          <StyledText color={theme.font1}>
            <label htmlFor="email">이메일</label>
          </StyledText>
          <StyledForm
            type="email"
            placeholder="example@example.com"
            id="email"
            value={email}
            onChange={(e) => handleInputChange(e, setEmail)}
          ></StyledForm>

          <StyledText color={theme.font1}>
            <label htmlFor="password">비밀번호</label>
          </StyledText>
          <StyledForm
            type="password"
            placeholder="8자 이상, 문자/숫자/기호 중 2종류 이상 조합"
            id="password"
            value={password}
            onChange={(e) => handleInputChange(e, setPassword)}
          ></StyledForm>

          <StyledText color={theme.font1}>
            <label htmlFor="password-check">비밀번호 확인</label>
          </StyledText>
          <StyledForm
            type="password"
            placeholder="8자 이상, 문자/숫자/기호 중 2종류 이상 조합"
            id="password-check"
            value={passwordCheck}
            onChange={(e) => handleInputChange(e, setPasswordCheck)}
          ></StyledForm>

          <StyledButton onClick={handleSignupClick}>회원가입</StyledButton>

          <StyledText align="center" color={theme.font2}>
            이미 계정이 있으신가요?
          </StyledText>
          <StyledText
            weight="600"
            align="center"
            color={theme.primary}
            margin="4px"
            cursor="pointer"
            onClick={() => dispatch(showLogin())}
          >
            로그인
          </StyledText>
        </Column>
      </Column>
    </ThemeProvider>
  );
}

let StyledText = styled.span`
  font-size: ${({ size = "14" }) => size + "px"};
  font-weight: ${({ weight }) => weight};
  color: ${({ color }) => color};
  text-align: ${({ align }) => align};
  margin: ${({ margin }) => margin};
  cursor: ${({ cursor = "default" }) => cursor};
`;

let StyledForm = styled.input`
  box-sizing: content-box;
  height: 28px;
  padding: 8px 16px;
  font-size: 14px;
  color: ${({ theme }) => theme.color.font1};
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: 8px;
  background-color: ${({ theme }) => theme.color.bg2};
  margin-top: 8px;
  margin-bottom: 16px;
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
  box-sizing: content-box;
  font-size: 16px;
  font-weight: 500;
  line-height: 20px;
  letter-spacing: 1px;
  margin: 16px 2px 16px 2px;
  color: ${({ theme }) => theme.color.bg};
  background-color: ${({ theme }) => theme.color.primary};
  border: 1px solid ${({ theme }) => theme.color.primary};
  border-radius: 8px;
  outline: none;
  cursor: pointer;
`;

let Column = styled.div`
  display: flex;
  flex-direction: column;
`;

export default SignupForm;
