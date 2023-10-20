import styled from "styled-components";
import { useSelector } from "react-redux";

function LoginForm() {
  const currentTheme = useSelector((state) => state.theme.themes[state.theme.currentTheme]);

  return (
    <Column>
      <StyledText color={currentTheme.secondaryColor} size="32" weight="700">
        웹법사와 함께 만드는
      </StyledText>
      <StyledText color={currentTheme.primaryColor} size="32" weight="700" align="right">
        만다라트
      </StyledText>
      <FormGroup></FormGroup>
    </Column>
  );
}

function FormGroup(props) {
  const currentTheme = useSelector((state) => state.theme.themes[state.theme.currentTheme]);

  return (
    <div>
      <Column gap="8">
        <StyledText color={currentTheme.secondaryColor} size="14" weight="600">
          <label htmlFor="user-id">아이디</label>
        </StyledText>
        <StyledForm
          type="email"
          placeholder="이메일을 입력해주세요"
          id="user-id"
          placeholderColor={currentTheme.secondaryColor}
          backgroundColor={currentTheme.backgroundColor}
          borderColor={currentTheme.primaryColor}
        ></StyledForm>
        <StyledText color={currentTheme.secondaryColor} size="14" weight="600">
          <label htmlFor="password">비밀번호</label>
        </StyledText>
        <StyledForm
          type="password"
          placeholder="비밀번호를 입력해주세요"
          id="password"
          placeholderColor={currentTheme.secondaryColor}
          backgroundColor={currentTheme.backgroundColor}
          borderColor={currentTheme.primaryColor}
        ></StyledForm>
      </Column>
    </div>
  );
}

let Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ gap }) => gap + "px"};
`;

let StyledText = styled.span`
  font-size: ${({ size }) => size + "px"};
  font-weight: ${({ weight }) => weight};
  color: ${({ color }) => color};
  text-align: ${({ align }) => align};
`;

let StyledForm = styled.input`
  height: 24px;
  padding: 8px 16px;
  font-size: 14px;
  background-color: ${({ backgroundColor }) => backgroundColor};
  border: 1px solid ${({ borderColor }) => borderColor};
  border-radius: 8px;
  outline: none;

  &::placeholder {
    color: ${({ placeholderColor }) => placeholderColor};
    opacity: 0.7;
  }
`;

export default LoginForm;
