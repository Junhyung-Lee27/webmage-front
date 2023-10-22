import styled from "styled-components";
import { useSelector } from "react-redux";

function LoginForm() {
  const currentTheme = useSelector((state) => state.theme.themes[state.theme.currentTheme]);

  return (
    <Column>
      <StyledText color={currentTheme.font1} size="32" weight="700">
        웹법사와 함께 만드는
      </StyledText>
      <StyledText color={currentTheme.primary} size="32" weight="700" align="right">
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
      <Column>
        <StyledText color={currentTheme.font1} size="14" weight="600" margin="32px 0px 0px 0px">
          <label htmlFor="user-id">아이디</label>
        </StyledText>
        <StyledForm
          type="email"
          placeholder="이메일을 입력해주세요"
          id="user-id"
          fontColor={currentTheme.font1}
          placeholderColor={currentTheme.font2}
          backgroundColor={currentTheme.bg2}
          borderColor={currentTheme.font1}
          margin="4px 0px 0px 0px"
        ></StyledForm>
        <StyledText color={currentTheme.font1} size="14" weight="600" margin="16px 0px 0px 0px">
          <label htmlFor="password">비밀번호</label>
        </StyledText>
        <StyledForm
          type="password"
          placeholder="비밀번호를 입력해주세요"
          id="password"
          fontColor={currentTheme.font1}
          placeholderColor={currentTheme.font2}
          backgroundColor={currentTheme.bg2}
          borderColor={currentTheme.font1}
          margin="4px 0px 24px 0px"
        ></StyledForm>
        <StyledButton 
          color= "white"
          backgroundColor={currentTheme.primary}
          borderColor={currentTheme.primary}
          margin="0px 2px">
          로그인
        </StyledButton>
        <StyledButton 
          color= "black"
          backgroundColor= "#FFFFFF"
          borderColor= "#000000"
          margin="8px 2px 0px 2px">
          구글로 시작하기
        </StyledButton>
        <StyledButton 
          color= "#191919"
          backgroundColor= "#FEE500"
          borderColor= "#FEE500"
          margin="8px 2px 0px 2px">
          카카오로 시작하기
        </StyledButton>
        <StyledButton
          color= "white"
          backgroundColor= "#03C75A"
          borderColor= "#03C75A"
          margin="8px 2px 0px 2px">
          네이버로 시작하기
        </StyledButton>
      </Column>
    </div>
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
  margin: ${({margin}) => margin};
`;

let StyledForm = styled.input`
  height: 24px;
  padding: 8px 16px;
  font-size: 14px;
  color: ${({ fontColor }) => fontColor};
  border: none;
  border-radius: 8px;
  background-color: ${({ backgroundColor }) => backgroundColor};
  margin: ${({margin}) => margin};
  &::placeholder {
    color: ${({ placeholderColor }) => placeholderColor};
    opacity: 0.5;
  }
  &:focus {
    outline: 2px solid ${({borderColor}) => borderColor};
  }
`;

let StyledButton = styled.button`
  height: 42px;
  font-size: 16px;
  font-weight: 700;
  line-height: 20px;
  margin: ${({margin}) => margin};
  color: ${({ color }) => color};
  background-color: ${({ backgroundColor }) => backgroundColor};
  border: 1px solid ${({ borderColor }) => borderColor};
  border-radius: 8px;
  outline: none;
`


export default LoginForm;
