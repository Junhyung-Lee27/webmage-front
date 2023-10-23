import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { showLogin } from "../store/authpageSlice";

function ForgotPassword() {
  const currentTheme = useSelector((state) => state.theme.themes[state.theme.currentTheme]);
  const dispatch = useDispatch();

  return (
    <Column>
      <StyledText color={currentTheme.font1} size="14" weight="600" margin="24px 0px 0px 0px">
        <label htmlFor="user-id">이메일</label>
      </StyledText>
      <StyledForm
        type="email"
        placeholder="가입한 이메일을 입력해주세요"
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
        margin="16px 2px 8px 2px"
        cursor="pointer"
      >
        임시 비밀번호 발송
      </StyledButton>

      <StyledText
        size="12"
        weight="700"
        align="center"
        color={currentTheme.font2}
        cursor="pointer"
        margin="24px"
        onClick={() => {
          dispatch(showLogin());
        }}
      >
        돌아가기
      </StyledText>
    </Column>
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
  cursor: ${({ cursor = "default" }) => cursor};
`;

export default ForgotPassword;