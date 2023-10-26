import styled, { ThemeProvider } from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import componentTheme from "./theme";
import { showDeleteAccount } from "../store/settingpageSlice";

function AccountView() {
  const colorTheme = useSelector((state) => state.theme.themes[state.theme.currentTheme]);
  const filterTheme = useSelector((state) => state.theme.filters[state.theme.currentTheme]);
  const theme = {
    color: colorTheme,
    filter: filterTheme,
    component: componentTheme,
  };

  const [isEditing, setIsEditing] = useState(false);

  return (
    <ThemeProvider theme={theme}>
      <AccountViewLayout>
        {isEditing ? (
          <AccountEdit theme={theme} />
        ) : (
          <AccountInfo theme={theme} setIsEditing={setIsEditing} />
        )}
      </AccountViewLayout>
    </ThemeProvider>
  );
}

function AccountInfo({ setIsEditing }) {
  const dispatch = useDispatch();
  
  return (
    <FormLayout>
      <LabelText>이메일</LabelText>
      <StyledBox>test@manda.com</StyledBox>
      <StyledButton onClick={() => setIsEditing(true)}>수정하기</StyledButton>
      <WithdrawText onClick={() => dispatch(showDeleteAccount())}>Manda 탈퇴하기</WithdrawText>
    </FormLayout>
  );
}

function AccountEdit() {
  return (
    <FormLayout>
      <LabelText>
        <label htmlFor="email">이메일</label>
      </LabelText>
      <StyledForm type="email" placeholder="변경할 이메일을 입력해주세요" id="email"></StyledForm>
      <LabelText>
        <label htmlFor="change-password">변경할 비밀번호</label>
      </LabelText>
      <StyledForm
        type="password"
        placeholder="변경할 비밀번호를 입력해주세요"
        id="change-password"
      ></StyledForm>
      <LabelText>
        <label htmlFor="change-password-check">변경할 비밀번호 확인</label>
      </LabelText>
      <StyledForm
        type="password"
        placeholder="변경할 비밀번호를 다시 한 번 입력해주세요"
        id="change-password-check"
      ></StyledForm>
      <StyledButton>완료</StyledButton>
    </FormLayout>
  );
}

let AccountViewLayout = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  justify-content: flex-start;
  align-items: center;
  padding-top: 14px;
`;

let FormLayout = styled.div`
  display: flex;
  flex-direction: column;
  width: 40%;
`;

let WithdrawText = styled.span`
  font-size: 14px;
  font-weight: 600;
  text-align: center;
  color: ${({ theme }) => theme.color.font1};
  margin-top: 40px;
  cursor: pointer;
  text-decoration: underline;
`;

let LabelText = styled.p`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.color.font1};
  margin: 24px 0px 0px 0px;
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

let StyledBox = styled.div`
  padding: 8px 16px;
  font-size: 14px;
  height: 24px;
  line-height: 24px;
  color: ${({ theme }) => theme.color.font2};
  border: none;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.color.bg2};
  margin-top: 4px;
  cursor: default;
`;

let StyledButton = styled.button`
  height: 42px;
  width: 80%;
  margin-left: auto;
  margin-right: auto;
  margin-top: 24px;
  font-size: 16px;
  font-weight: 700;
  line-height: 20px;
  color: white;
  background-color: ${({ theme }) => theme.color.primary};
  border: 1px solid ${({ theme }) => theme.color.primary};
  border-radius: 8px;
  outline: none;
  cursor: pointer;
`;

export default AccountView;
