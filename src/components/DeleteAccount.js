import styled, { ThemeProvider } from "styled-components";
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import componentTheme from "./theme";
import { showProfileEdit } from "./../store/settingpageSlice";

function DeleteAccount() {
  const colorTheme = useSelector((state) => state.theme.themes[state.theme.currentTheme]);
  const combinedTheme = {
    color: colorTheme,
    component: componentTheme,
  };
  const navigate = useNavigate();
  const dispatch = useDispatch();



  return (
    <ThemeProvider theme={combinedTheme}>
      <ModalOverlay>
        <ModalContent>
          <StyledText>정말 탈퇴하시나요? 😢</StyledText>
          <Buttons>
            <StyledButton
              color={colorTheme.primary}
              backgroundcolor={colorTheme.bg}
              bordercolor={colorTheme.primary}
              onClick={() => dispatch(showProfileEdit())}
            >
              취소
            </StyledButton>
            <StyledButton color="white" backgroundcolor={colorTheme.primary}>
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
  gap: 32px;
`;

let StyledText = styled.span`
  font-size: 20px;
  font-weight: 700;
  text-align: center;
  color: ${({ theme }) => theme.color.font1};
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
  min-width: 60%;
  padding: 12px 24px;
  color: ${({ color }) => color};
  background-color: ${({ backgroundcolor }) => backgroundcolor};
  border: 1px solid ${({ bordercolor }) => bordercolor};
  border-radius: 8px;
  outline: none;
  cursor: pointer;
`;

export default DeleteAccount;
