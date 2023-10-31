import styled, { ThemeProvider } from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import componentTheme from "./theme";
import { showAccountView } from "./../store/settingpageSlice";
import { resetUserState } from "./../store/userSlice";
import { useNavigate } from "react-router-dom";
import { deleteUser } from "./../services/authService";

function DeleteAccount() {
  // 테마
  const colorTheme = useSelector((state) => state.theme.themes[state.theme.currentTheme]);
  const theme = {
    color: colorTheme,
    component: componentTheme,
  };

  const dispatch = useDispatch(); // 스토어 상태 업데이트
  const navigate = useNavigate(); // 화면 네이게이터

  // get token
  const token = useSelector((state) => state.user.token);
  console.log(token);

  // 회원탈퇴 요청
  const handleDeleteUser = async (token) => {
    const response = await deleteUser(token);
    // 회원탈퇴 성공했을 경우
    if (response.success) {
      dispatch(resetUserState()); // 유저 상태 초기화
      navigate("/"); // 로그인 화면으로 이동
    } else if (response.error) {
      alert(response.error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <ModalOverlay>
        <ModalContent>
          <StyledText
            fontsize="20px"
            fontweight="700"
            color={theme.color.font1}
            margin="0px 0px 56px 0px"
            align="center"
          >
            정말 탈퇴하시나요? 😢
          </StyledText>
          <StyledText
            fontsize="14px"
            fontweight="500"
            color={theme.color.font2}
            margin="0px 0px 12px 0px"
            align="left"
          >
            안전한 탈퇴를 위해 비밀번호를 입력해주세요.
          </StyledText>
          <StyledForm type="password" placeholder="비밀번호 입력"></StyledForm>
          <StyledText
            fontsize="16px"
            fontweight="600"
            color={theme.color.font1}
            margin="0px 0px 16px 0px"
          >
            탈퇴시, 계정은 삭제되며 복구되지 않습니다.
          </StyledText>
          <Buttons>
            <StyledButton
              color={theme.color.font1}
              backgroundcolor={theme.color.bg3}
              border="none"
              onClick={() => dispatch(showAccountView())}
            >
              취소
            </StyledButton>
            <StyledButton
              onClick={() => handleDeleteUser(token)}
              color="white"
              backgroundcolor="#FF4C4C"
            >
              탈퇴하기
            </StyledButton>
          </Buttons>
        </ModalContent>
      </ModalOverlay>
    </ThemeProvider>
  );
}

let ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7); /* 검정색 배경에 70% 투명도 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

let ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.color.bg};
  padding: 54px 64px;
  border-radius: 8px;
  max-width: 808px;
  max-height: 80%;
`;

let StyledText = styled.span`
  font-size: ${({ fontsize }) => fontsize};
  font-weight: ${({ fontweight }) => fontweight};
  color: ${({ color }) => color};
  margin: ${({ margin }) => margin};
  text-align: ${({ align }) => align};
  width: 100%;
`;

let Buttons = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  gap: 8px;
`;

let StyledButton = styled.button`
  height: 42px;
  font-size: 16px;
  font-weight: 700;
  line-height: 20px;
  width: 50%;
  min-width: 50%;
  padding: 12px 24px;
  color: ${({ color }) => color};
  background-color: ${({ backgroundcolor }) => backgroundcolor};
  border: none;
  border-radius: 8px;
  outline: none;
  cursor: pointer;
`;

let StyledForm = styled.input`
  width: 100%;
  box-sizing: border-box;
  padding: 16px;
  font-size: 14px;
  color: ${({ theme }) => theme.color.font1};
  border: none;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.color.bg2};
  margin-bottom: 40px;
  &::placeholder {
    color: ${({ theme }) => theme.color.font2};
    opacity: 0.5;
  }
  &:focus {
    outline: 2px solid ${({ theme }) => theme.color.primary};
  }
`;

export default DeleteAccount;
