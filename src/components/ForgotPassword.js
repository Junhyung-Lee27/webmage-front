import styled, {ThemeProvider} from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { showLogin } from "../store/authpageSlice";

function ForgotPassword() {
  const theme = useSelector((state) => state.theme.themes[state.theme.currentTheme]);
  const dispatch = useDispatch();

  return (
    <ThemeProvider theme={theme}>
      <Column>
        <StyledText color={theme.font1} size="14" weight="600" margin="24px 0px 0px 0px">
          <label htmlFor="user-id">이메일</label>
        </StyledText>
        <StyledForm
          type="email"
          placeholder="가입한 이메일을 입력해주세요"
          id="user-id"
        ></StyledForm>
        <StyledButton>임시 비밀번호 발송</StyledButton>

        <StyledText
          color={theme.font2}
          size="12"
          weight="700"
          align="center"
          cursor="pointer"
          onClick={() => {
            dispatch(showLogin());
          }}
        >
          돌아가기
        </StyledText>
      </Column>
    </ThemeProvider>
  );
}

let Column = styled.div`
  display: flex;
  flex-direction: column;
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
  color: ${({ theme }) => theme.font1};
  border: none;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.bg2};
  margin: 4px 0px 0px 0px;
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
  margin: 16px 2px 8px 2px;
  color: white;
  background-color: ${({ theme }) => theme.primary};
  border: 1px solid ${({ theme }) => theme.primary};
  border-radius: 8px;
  outline: none;
  cursor: pointer;
`;

export default ForgotPassword;