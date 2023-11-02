import styled, { ThemeProvider } from "styled-components";
import { useSelector } from "react-redux";
import ThemeSwitch from "../components/ThemeSwitch";
import LoginForm from "../components/LoginForm";
import SignupForm from "../components/SignupForm";
import ForgotPassword from "../components/ForgotPassword";
import componentTheme from "./../components/theme";

function AuthPage() {
  const showingForm = useSelector((state) => state.authpage.showingForm);

  const colorTheme = useSelector((state) => state.theme.themes[state.theme.currentTheme]);
  const filterTheme = useSelector((state) => state.theme.filters[state.theme.currentTheme]);
  const theme = {
    color: colorTheme,
    filter: filterTheme,
    component: componentTheme,
  };

  return (
    <ThemeProvider theme={theme}>
      <PageLayout>
        <MandaIcon src={process.env.PUBLIC_URL + "/logo/Manda_logo1.svg"} />
        <Column>
          <StyledText color={theme.color.font1} size="32" weight="700" margin="0px 0px 6px 0px">
            웹법사와 함께 만드는
          </StyledText>
          <StyledText
            color={theme.color.primary}
            size="32"
            weight="700"
            align="right"
            margin="0px 0px 12px 0px"
          >
            만다라트
          </StyledText>
          <ThemeSwitch />
          {showingForm === "Login" && <LoginForm />}
          {showingForm === "Signup" && <SignupForm />}
          {showingForm === "ForgotPassword" && <ForgotPassword />}
        </Column>
      </PageLayout>
    </ThemeProvider>
  );
}

let PageLayout = styled.div`
  ${({ theme }) => theme.component.font.importPretendard};
  font-family: Pretendard-Regular;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  gap: 80px;
  background-color: ${({ theme }) => theme.color.bg};
`;

let MandaIcon = styled.img`
  height: 500px;
  width: 500px;
`;

let Column = styled.div`
  display: flex;
  flex-direction: column;
  height: 500px;
`;

let StyledText = styled.span`
  letter-spacing: 3px;
  font-size: ${({ size }) => size + "px"};
  font-weight: ${({ weight }) => weight};
  color: ${({ color }) => color};
  text-align: ${({ align }) => align};
  margin: ${({ margin }) => margin};
  cursor: ${({ cursor = "default" }) => cursor};
`;

export default AuthPage;
