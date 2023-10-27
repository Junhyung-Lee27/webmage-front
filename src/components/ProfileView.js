import styled, { ThemeProvider } from "styled-components";
import { useState } from "react";
import { useSelector } from "react-redux";
import componentTheme from "./theme";

function ProfileView() {
  // 테마
  const colorTheme = useSelector((state) => state.theme.themes[state.theme.currentTheme]);
  const filterTheme = useSelector((state) => state.theme.filters[state.theme.currentTheme]);
  const theme = {
    color: colorTheme,
    filter: filterTheme,
    component: componentTheme,
  };

  // 편집 중 상태 관리
  const [isEditing, setIsEditing] = useState(false);

  // 현재 로그인 사용자
  const username = useSelector((state) => state.user.username)

  return (
    <ThemeProvider theme={theme}>
      <ProfileViewLayout>
        {isEditing ? (
          <ProfileEdit />
        ) : (
          <ProfileInfo setIsEditing={setIsEditing} username={username} />
        )}
      </ProfileViewLayout>
    </ThemeProvider>
  );
}

function ProfileInfo({ setIsEditing, username }) {
  return (
    <FormLayout>
      <ProfileImgLayout>
        <ProfileImg src={process.env.PUBLIC_URL + "/testImg/profile1.jpg"} />
      </ProfileImgLayout>

      <LabelText>닉네임</LabelText>
      <StyledBox>{username}</StyledBox>

      <LabelText>소속</LabelText>
      <StyledBox>이스트소프트 오르미 2기</StyledBox>

      <LabelText>해시태그</LabelText>
      <StyledBox>#webmage, #웹법사, #Oreumi, #Front-end</StyledBox>

      <StyledButton onClick={() => setIsEditing(true)}>수정하기</StyledButton>
    </FormLayout>
  );
}

function ProfileEdit() {
  return (
    <FormLayout>
      <ProfileImgLayout>
        <ProfileImg src={process.env.PUBLIC_URL + "/testImg/profile1.jpg"} />
        <ImgEditBtn src={process.env.PUBLIC_URL + "/icon/edit.svg"} />
      </ProfileImgLayout>

      <LabelText>
        <label htmlFor="username">닉네임</label>
      </LabelText>
      <StyledForm type="text" placeholder="닉네임을 입력해주세요" id="username"></StyledForm>

      <LabelText>
        <label htmlFor="organization">소속</label>
      </LabelText>
      <StyledForm type="text" placeholder="소속을 입력해주세요" id="organization"></StyledForm>

      <LabelText>
        <label htmlFor="tag">태그</label>
      </LabelText>
      <StyledForm type="text" placeholder="태그를 입력해주세요" id="tag"></StyledForm>

      <StyledButton>완료</StyledButton>
    </FormLayout>
  );
}

let ProfileViewLayout = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  justify-content: flex-start;
  align-items: center;
  margin-top: 40px;
`;

let ProfileImgLayout = styled.div`
  position: relative;
  max-width: fit-content;
  margin-left: auto;
  margin-right: auto;
`;

let ProfileImg = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
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
  width: 40%;
`;

let LabelText = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.color.font1};
  margin: 24px 0px 0px 0px;
  cursor: ${({ cursor = "default" }) => cursor};
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

export default ProfileView;
