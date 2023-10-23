import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { showLogin } from "../store/authpageSlice";

function SignupForm() {
  const currentTheme = useSelector((state) => state.theme.themes[state.theme.currentTheme]);
  const dispatch = useDispatch();

  return (
    <Column>
      <Column>
        <StyledText color={currentTheme.font1} size="14" weight="600" margin="16px 0px 0px 0px">
          <label htmlFor="user-id">아이디</label>
        </StyledText>
        <StyledForm
          type="email"
          placeholder="사용할 이메일을 입력해주세요"
          id="user-id"
          fontColor={currentTheme.font1}
          placeholderColor={currentTheme.font2}
          backgroundColor={currentTheme.bg2}
          borderColor={currentTheme.font1}
          margin="4px 0px 0px 0px"
        ></StyledForm>

        <StyledText color={currentTheme.font1} size="14" weight="600" margin="16px 0px 0px 0px">
          <label htmlFor="user-id">비밀번호</label>
        </StyledText>
        <StyledForm
          type="email"
          placeholder="사용할 비밀번호를 입력해주세요"
          id="user-id"
          fontColor={currentTheme.font1}
          placeholderColor={currentTheme.font2}
          backgroundColor={currentTheme.bg2}
          borderColor={currentTheme.font1}
          margin="4px 0px 0px 0px"
        ></StyledForm>

        <StyledText color={currentTheme.font1} size="14" weight="600" margin="16px 0px 0px 0px">
          <label htmlFor="password">비밀번호 확인</label>
        </StyledText>
        <StyledForm
          type="email"
          placeholder="비밀번호를 다시 입력해주세요"
          id="user-id"
          fontColor={currentTheme.font1}
          placeholderColor={currentTheme.font2}
          backgroundColor={currentTheme.bg2}
          borderColor={currentTheme.font1}
          margin="4px 0px 0px 0px"
        ></StyledForm>

        <StyledButton
          color="white"
          backgroundColor={currentTheme.primary}
          borderColor={currentTheme.primary}
          margin="16px 2px 24px 2px"
        >
          회원가입
        </StyledButton>

        <StyledText size="14" align="center" color={currentTheme.font2}>
          이미 계정이 있으신가요?
        </StyledText>
        <StyledText
          size="14"
          weight="700"
          align="center"
          color={currentTheme.primary}
          margin="4px 0px 0px 0px"
          cursor="pointer"
          onClick={() => dispatch(showLogin())}
        >
          로그인
        </StyledText>
      </Column>
    </Column>
  );
}

let StyledForm = styled.input`
  height: 24px;
  padding: 8px 16px;
  font-size: 14px;
  color: ${({ fontColor }) => fontColor};
  border: none;
  border-radius: 8px;
  background-color: ${({ backgroundColor }) => backgroundColor};
  margin: ${({ margin }) => margin};
  &::placeholder {
    color: ${({ placeholderColor }) => placeholderColor};
    opacity: 0.5;
  }
  &:focus {
    outline: 2px solid ${({ borderColor }) => borderColor};
  }
`;

let StyledButton = styled.button`
  height: 42px;
  font-size: 16px;
  font-weight: 700;
  line-height: 20px;
  margin: ${({ margin }) => margin};
  color: ${({ color }) => color};
  background-color: ${({ backgroundColor }) => backgroundColor};
  border: 1px solid ${({ borderColor }) => borderColor};
  border-radius: 8px;
  outline: none;
`;

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

export default SignupForm;
