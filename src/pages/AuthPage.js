import styled from "styled-components";
import { useSelector } from "react-redux";
import MandaIconUrl from "./../assets/images/Manda_icon.svg";
import ThemeToggle from "../components/ThemeToggle";
import LoginForm from "../components/LoginForm";
import SignupForm from "../components/SignupForm";
import ForgotPassword from "../components/ForgotPassword";


function AuthPage() {
  const currentTheme = useSelector((state) => state.theme.themes[state.theme.currentTheme]);
  const showingForm = useSelector((state) => state.authpage.showingForm);
  
  return (
    <Layout theme={currentTheme}>
      <MandaIcon />
      <Column>
        <StyledText color={currentTheme.font1} size="32" weight="700">
          웹법사와 함께 만드는
        </StyledText>
        <StyledText color={currentTheme.primary} size="32" weight="700" align="right">
          만다라트
        </StyledText>
        {showingForm === "Login" && <LoginForm />}
        {showingForm === "Signup" && <SignupForm />}
        {showingForm === "ForgotPassword" && <ForgotPassword />}
      </Column>
      <ThemeToggle />
    </Layout>
  );
}

let Column = styled.div`
  display: flex;
  flex-direction: column;
`;

let Layout = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  gap: 160px;
  background-color: ${(props) => props.theme.bg};
`;

let MandaIcon = styled.div`
  background-image: url(${MandaIconUrl});
  height: 500px;
  width: 500px;
  background-size: cover;
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
