import styled from "styled-components";
import { useSelector } from "react-redux";
import MandaIconUrl from "./../assets/images/Manda_icon.svg";
import ThemeToggle from "../components/ThemeToggle";
import LoginForm from "../components/LoginForm";



function LoginPage() {
  const currentTheme = useSelector((state) => state.theme.themes[state.currentTheme]);
  
  return (
    <Layout theme={currentTheme}>
      <MandaIcon></MandaIcon>
      <LoginForm></LoginForm>
      <ThemeToggle></ThemeToggle>
    </Layout>
  );
}

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



export default LoginPage;
