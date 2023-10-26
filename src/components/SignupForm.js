import styled, { ThemeProvider } from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { showLogin } from "../store/authpageSlice";

function SignupForm() {
  const theme = useSelector((state) => state.theme.themes[state.theme.currentTheme]);
  const dispatch = useDispatch();

  return (
    <ThemeProvider theme={theme}>
      <Column>
        <Column>
          <StyledText color={theme.font1}>
            <label htmlFor="user-id">아이디</label>
          </StyledText>
          <StyledForm
            type="email"
            placeholder="사용할 이메일을 입력해주세요"
            id="user-id"
          ></StyledForm>

          <StyledText color={theme.font1}>
            <label htmlFor="user-id">비밀번호</label>
          </StyledText>
          <StyledForm
            type="password"
            placeholder="사용할 비밀번호를 입력해주세요"
            id="password"
          ></StyledForm>

          <StyledText color={theme.font1}>
            <label htmlFor="password">비밀번호 확인</label>
          </StyledText>
          <StyledForm
            type="password"
            placeholder="비밀번호를 다시 입력해주세요"
            id="password-check"
          ></StyledForm>

          <StyledButton>회원가입</StyledButton>

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
