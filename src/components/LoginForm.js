import styled, { ThemeProvider } from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { showSignup, showForgotPassword } from "../store/authpageSlice";

function LoginForm() {
  const theme = useSelector((state) => state.theme.themes[state.theme.currentTheme]);
  const dispatch = useDispatch();

  return (
    <ThemeProvider theme={theme}>
      <div>
        <Column>
          <StyledText color={theme.font1} size="14" weight="600" margin="24px 0px 0px 0px">
            <label htmlFor="user-id">아이디</label>
          </StyledText>
          <StyledForm type="email" placeholder="이메일을 입력해주세요" id="user-id"></StyledForm>
          <StyledText color={theme.font1} size="14" weight="600" margin="16px 0px 0px 0px">
            <label htmlFor="password">비밀번호</label>
          </StyledText>
          <StyledForm
            type="password"
            placeholder="비밀번호를 입력해주세요"
            id="password"
          ></StyledForm>
          <StyledButton color="white">로그인</StyledButton>
          <Row>
            <StyledText
              size="12"
              weight="700"
              align="center"
              color={theme.font2}
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
              color={theme.font2}
              cursor="pointer"
              onClick={() => {
                dispatch(showForgotPassword());
              }}
            >
              비밀번호 찾기
            </StyledText>
          </Row>
          <LineText>간편 로그인</LineText>
          <SocialLogin theme={theme}></SocialLogin>
        </Column>
      </div>
    </ThemeProvider>
  );
}

function SocialLogin() {
  return (
    <Column>
      <Row margin="16px 0px 0px 0px">
        <CircleButton
          color="black"
          backgroundColor="#FFFFFF"
          border="1px solid #000000"
          borderColor="#000000"
        >
          G
        </CircleButton>
        <CircleButton color="#191919" backgroundColor="#FEE500" border="none" borderColor="#FEE500">
          K
        </CircleButton>
        <CircleButton color="white" backgroundColor="#03C75A" border="none" borderColor="#03C75A">
          N
        </CircleButton>
      </Row>
    </Column>
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
  margin: 24px 2px 8px 2px;
  color: ${({ color }) => color};
  background-color: ${({ theme }) => theme.primary};
  border: 1px solid ${({ theme }) => theme.primary};
  border-radius: 8px;
  outline: none;
  cursor: pointer;
`;

let CircleButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${({ backgroundColor }) => backgroundColor};
  color: ${({ color }) => color};
  border: ${({ border }) => border};
  outline: none;
  cursor: pointer;
  display: flex; // 버튼 내부의 텍스트를 가운데 위치
  justify-content: center;
  align-items: center;
`;

const LineText = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.font2};
  display: flex;
  align-items: center;
  text-align: center;
  margin: 24px 0px 0px 0px;
  cursor: default;

  &:before,
  &:after {
    content: "";
    flex: 1;
    border-bottom: 1px solid ${({ theme }) => theme.border};
  }

  &:before {
    margin-right: 0.5em;
  }

  &:after {
    margin-left: 0.5em;
  }
`;

export default LoginForm;
