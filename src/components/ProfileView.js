import styled, { ThemeProvider } from "styled-components";
import { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import componentTheme from "./theme";
import axios from "axios";
import { setUser } from "../store/userSlice";

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

  // 현재 사용자 정보
  const user = useSelector((state) => state.user);

  return (
    <ThemeProvider theme={theme}>
      <ProfileViewLayout>
        {isEditing ? (
          <ProfileEdit setIsEditing={setIsEditing} user={user} />
        ) : (
          <ProfileInfo setIsEditing={setIsEditing} user={user} />
        )}
      </ProfileViewLayout>
    </ThemeProvider>
  );
}

function ProfileInfo({ setIsEditing, user }) {
  return (
    <FormLayout>
      <ProfileImgLayout>
        <ProfileImg src={process.env.PUBLIC_URL + "/testImg/profile1.jpg"} />
      </ProfileImgLayout>

      <LabelText>닉네임</LabelText>
      <StyledBox>{user.username}</StyledBox>

      <LabelText>소속</LabelText>
      <StyledBox>{user.position}</StyledBox>

      <LabelText>해시태그</LabelText>
      <StyledBox>{user.hash}</StyledBox>

      <StyledButton onClick={() => setIsEditing(true)}>수정하기</StyledButton>
    </FormLayout>
  );
}

function ProfileEdit({ user, setIsEditing }) {
  const dispatch = useDispatch();
  const authToken = useSelector((state) => state.user.authToken);
  const fileInputRef = useRef(null);
  
  // 입력값 상태 관리
  const [username, setUsername] = useState("");
  const [userPosition, setUserPosition] = useState("");
  const [userInfo, setUserInfo] = useState("");
  const [userHash, setUserHash] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  const handleInputChange = (e, setState) => {
    setState(e.target.value);
  };
  
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  // 변경된 프로필 정보 저장 요청
  const handleEditProfile = async (authToken) => {
    const axiosConfig = {
      headers: {
        Authorization: `Token ${authToken}`, // 헤더에 토큰 추가
      },
    };

    // 전송 데이터 준비
    let formData = new FormData();
    formData.append("username", username);
    formData.append("user_img", selectedImage); // 이미지 추가
    formData.append("user_position", userPosition);
    formData.append("user_info", userInfo);
    formData.append("user_hash", userHash);

    // 서버 요청
    const response = await axios.post(
      "http://127.0.0.1:8000/user/profile/edit",
      formData,
      axiosConfig
    );

    // 프로필정보 수정 성공했을 경우
    if (response.success) {
      dispatch(
        setUser({
          username: username,
          userImg: selectedImage,
          position: userPosition,
          info: userInfo,
          hash: userHash,
        })
      ); // 이메일 상태 업데이트
      setIsEditing(false); // 수정 모드 종료
      alert("수정 완료");
    } else if (response.error) {
      alert(response.error);
    }
  };

  return (
    <FormLayout>
      <ProfileImgLayout>
        <ProfileImg src={process.env.PUBLIC_URL + "/testImg/profile1.jpg"} />
        <ImgInput type="file" onChange={handleImageChange} ref={fileInputRef}></ImgInput>
        <ImgEditBtn
          src={process.env.PUBLIC_URL + "/icon/edit.svg"}
          onClick={() => fileInputRef.current.click()}
        />
      </ProfileImgLayout>

      <LabelText>
        <label htmlFor="username">닉네임</label>
      </LabelText>
      <StyledForm
        type="text"
        id="username"
        value={username || user.username}
        onChange={(e) => handleInputChange(e, setUsername)}
      ></StyledForm>

      <LabelText>
        <label htmlFor="position">소속</label>
      </LabelText>
      <StyledForm
        type="text"
        id="position"
        placeholder={user.position ? user.position : "소속을 입력해주세요"}
        value={userPosition || user.position}
        onChange={(e) => handleInputChange(e, setUserPosition)}
      ></StyledForm>

      <LabelText>
        <label htmlFor="info">자기소개</label>
      </LabelText>
      <StyledForm
        type="text"
        id="info"
        placeholder={user.info ? user.info : "다른 분들께 소개할 내용을 입력해주세요"}
        value={userInfo || user.info}
        onChange={(e) => handleInputChange(e, setUserInfo)}
      ></StyledForm>

      <LabelText>
        <label htmlFor="hash">해시태그</label>
      </LabelText>
      <StyledForm
        type="text"
        id="hash"
        placeholder={user.hash ? user.hash : "관심 해시태그를 입력해주세요"}
        value={userHash || user.hash}
        onChange={(e) => handleInputChange(e, setUserHash)}
      ></StyledForm>

      <StyledButton
        onClick={() => {
          handleEditProfile(authToken);
        }}
      >
        완료
      </StyledButton>
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

let ImgInput = styled.input`
  display: none;
`

let ImgEditBtn = styled.img`
  ${({ theme }) => theme.component.iconSize.small};
  filter: ${({ theme }) => theme.filter.font1};
  position: absolute;
  bottom: -10px;
  right: -10px;
  cursor: pointer;
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
  box-sizing: content-box;
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
  box-sizing: content-box;
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
