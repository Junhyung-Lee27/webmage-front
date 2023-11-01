import { useState } from "react";
import styled, { ThemeProvider } from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { showLogin } from "../store/authpageSlice";
import { useNavigate } from "react-router-dom";
import { signup, login } from "../services/authService";
import { setIsLoggedIn, setUser, setAuthToken } from "../store/userSlice";
import axios from "axios";

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
    const signupResponse = await signup(username, email, password, passwordCheck);

    // 회원가입 성공했을 경우
    if (signupResponse.success) {
      // 로그인 시도
      const loginResponse = await login(username, password);
      
      if (loginResponse.success) {
        try {
          const userResponse = await axios.get(
            `http://127.0.0.1:8000/user/profile/${loginResponse.userId}`
          );
          dispatch(
            setUser({
              userId: userResponse.data.user_id,
              username: username,
              userImg: "",
              position: "",
              info: "",
              hash: "",
              email: email,
              successCount: 0,
            })
          );
        } catch (error) {
          console.error(error);
        }

        dispatch(setAuthToken(loginResponse.token));
        dispatch(setIsLoggedIn(true));
        navigate("/");
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
            <label htmlFor="username">닉네임</label>
          </StyledText>
          <StyledForm
            type="text"
            placeholder="닉네임을 입력해주세요"
            id="username"
            value={username}
            onChange={(e) => handleInputChange(e, setUsername)}
          ></StyledForm>

          <StyledText color={theme.font1}>
            <label htmlFor="email">이메일</label>
          </StyledText>
          <StyledForm
            type="email"
            placeholder="이메일을 입력해주세요"
            id="email"
            value={email}
            onChange={(e) => handleInputChange(e, setEmail)}
          ></StyledForm>

          <StyledText color={theme.font1}>
            <label htmlFor="password">비밀번호</label>
          </StyledText>
          <StyledForm
            type="password"
            placeholder="비밀번호를 입력해주세요"
            id="password"
            value={password}
            onChange={(e) => handleInputChange(e, setPassword)}
          ></StyledForm>

          <StyledText color={theme.font1}>
            <label htmlFor="password-check">비밀번호 확인</label>
          </StyledText>
          <StyledForm
            type="password"
            placeholder="비밀번호를 다시 입력해주세요"
            id="password-check"
            value={passwordCheck}
            onChange={(e) => handleInputChange(e, setPasswordCheck)}
          ></StyledForm>

          <StyledButton onClick={handleSignupClick}>회원가입</StyledButton>

          <StyledText weight="500" align="center" color={theme.font2}>
            이미 계정이 있으신가요?
          </StyledText>
          <StyledText
            weight="700"
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
  font-size: 14px;
  font-weight: ${({ weight = "600" }) => weight};
  color: ${({ color }) => color};
  text-align: ${({ align }) => align};
  margin-top: ${({ margin = "16px" }) => margin};
  cursor: ${({ cursor = "default" }) => cursor};
`;

let StyledForm = styled.input`
  box-sizing: content-box;
  height: 24px;
  padding: 8px 16px;
  font-size: 14px;
  color: ${({ theme }) => theme.font1};
  border: none;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.bg2};
  margin-top: 4px;

  &::placeholder {
    color: ${({ theme }) => theme.font2};
    opacity: 0.5;
  }
  &:focus {
    outline: 2px solid ${({ theme }) => theme.primary};
  }
`;

let StyledButton = styled.button`
  height: 42px;
  font-size: 16px;
  font-weight: 700;
  line-height: 20px;
  margin: 16px 2px 0px 2px;
  color: white;
  background-color: ${({ theme }) => theme.primary};
  border: 1px solid ${({ theme }) => theme.primary};
  border-radius: 8px;
  outline: none;
  cursor: pointer;
`;

let Column = styled.div`
  display: flex;
  flex-direction: column;
`;

export default SignupForm;
