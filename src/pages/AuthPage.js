import styled from "styled-components";
import MandaIconUrl from "./../assets/images/Manda_icon.svg";
import ThemeToggle from "../components/ThemeToggle";
import { useSelector } from "react-redux";

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

function LoginForm() {
  const currentTheme = useSelector((state) => state.theme.themes[state.theme.currentTheme]);

  return (
    <ColumnContainer>
      <StyledText color={currentTheme.secondaryColor} size="32" weight="700">
        웹법사와 함께 만드는
      </StyledText>
      <StyledText color={currentTheme.primaryColor} size="32" weight="700" align="right">
        만다라트
      </StyledText>
    </ColumnContainer>
  );
}

let StyledText = styled.span`
  font-size: ${({ size}) => size + "px"}; 
  font-weight: ${({weight}) => weight};
  color: ${({color}) => color};
  text-align: ${({align}) => align};
`

let Layout = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  gap: 160px;
  background-color: ${(props) => props.theme.backgroundColor};
`;

let MandaIcon = styled.div`
  background-image: url(${MandaIconUrl});
  height: 500px;
  width: 500px;
  background-size: cover;
`;

let ColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

let StyledBtn = styled.button`
  background-color: white;
`;

export default LoginPage;
