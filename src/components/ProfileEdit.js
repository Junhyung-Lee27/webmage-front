import styled, { ThemeProvider } from "styled-components";
import { useSelector } from "react-redux";
import componentTheme from "./theme"

function ProfileEdit() {
  const colorTheme = useSelector((state) => state.theme.themes[state.theme.currentTheme]);
  const filterTheme = useSelector((state) => state.theme.filters[state.theme.currentTheme]);
  const theme = {
    color: colorTheme,
    filter: filterTheme,
    component: componentTheme,
  };

  return (
    <ThemeProvider theme={theme}>
      <ProfileEditLayout>
        <ProfileImgLayout>
          <ProfileImg src={process.env.PUBLIC_URL + "/testImg/profile1.svg"} />
          <ImgEditBtn src={process.env.PUBLIC_URL + "/icon/edit.svg"} />
        </ProfileImgLayout>
        <FormLayout>
          <LabelText>
            <label htmlFor="username">닉네임</label>
          </LabelText>
          <StyledForm
            type="text"
            placeholder="변경할 닉네임을 입력해주세요"
            id="username"
          ></StyledForm>

          <LabelText>
            <label htmlFor="email">이메일</label>
          </LabelText>
          <StyledForm
            type="email"
            placeholder="변경할 이메일을 입력해주세요"
            id="email"
          ></StyledForm>

          <LabelText>
            <label htmlFor="password">비밀번호</label>
          </LabelText>
          <StyledForm
            type="password"
            placeholder="변경할 비밀번호를 입력해주세요"
            id="password"
          ></StyledForm>

          <StyledButton>수정 완료</StyledButton>
        </FormLayout>
      </ProfileEditLayout>
    </ThemeProvider>
  );
}
let ProfileEditLayout = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  justify-content: flex-start;
  align-items: center;
`

let ProfileImgLayout = styled.div`
  position: relative;
  margin: 40px 0px;
`;

let ProfileImg = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
`;

let ImgEditBtn = styled.img`
  ${({ theme }) => theme.component.iconSize.small};
  filter: ${({ theme }) => theme.filter.font1};
  position: absolute;
  bottom: -10px;
  right: -10px;
`;

let FormLayout = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
`

let LabelText = styled.span`
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

let StyledButton = styled.button`
  height: 42px;
  font-size: 16px;
  font-weight: 700;
  line-height: 20px;
  margin: 24px 2px 8px 2px;
  color: white;
  background-color: ${({ theme }) => theme.color.primary};
  border: 1px solid ${({ theme }) => theme.color.primary};
  border-radius: 8px;
  outline: none;
  cursor: pointer;
`;

export default ProfileEdit;
