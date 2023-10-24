import styled, { ThemeProvider } from "styled-components";
import { useSelector } from "react-redux";
import MandaIconUrl from "./../assets/images/Manda_icon.svg";
import ThemeSwitch from "../components/ThemeSwitch";
import LoginForm from "../components/LoginForm";
import SignupForm from "../components/SignupForm";
import ForgotPassword from "../components/ForgotPassword";


function AuthPage() {
  const theme = useSelector((state) => state.theme.themes[state.theme.currentTheme]);
  const showingForm = useSelector((state) => state.authpage.showingForm);
  
  return (
    <ThemeProvider theme={theme}>
      <PageLayout>
        <MandaIcon />
        <Column>
          <StyledText color={theme.font1} size="32" weight="700">
            웹법사와 함께 만드는
          </StyledText>
          <StyledText color={theme.primary} size="32" weight="700" align="right">
            만다라트
          </StyledText>
          {showingForm === "Login" && <LoginForm />}
          {showingForm === "Signup" && <SignupForm />}
          {showingForm === "ForgotPassword" && <ForgotPassword />}
        </Column>
        <ThemeSwitch />
      </PageLayout>
    </ThemeProvider>
  );
}

let PageLayout = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  gap: 160px;
  background-color: ${({ theme }) => theme.bg};
`;

let MandaIcon = styled.div`
  background-image: url(${MandaIconUrl});
  height: 500px;
  width: 500px;
  background-size: cover;
`;

let Column = styled.div`
  display: flex;
  flex-direction: column;
  height: 500px;
`;

let StyledText = styled.span`
  font-size: ${({ size }) => size + "px"};
  font-weight: ${({ weight }) => weight};
  color: ${({ color }) => color};
  text-align: ${({ align }) => align};
  margin: ${({ margin }) => margin};
  cursor: ${({ cursor = "default" }) => cursor};
`;

export default AuthPage;
