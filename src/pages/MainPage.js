import styled from "styled-components";
import { useSelector } from "react-redux";
import Header from "../components/Header";
import Manda from "../components/Manda";
import MandaTitle from "../components/MandaTitle";

function MainPage() {
  const currentTheme = useSelector((state) => state.theme.themes[state.theme.currentTheme]);

  return (
    <PageLayout backgroundColor={currentTheme.bg2}>
      <Header></Header>
      <MandaTitle />
      <Manda />
      <div>아래 내용 추가 예정 </div>
    </PageLayout>
  );
}

let PageLayout = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  gap: 40px;
  background-color: ${({ backgroundColor }) => backgroundColor};
`;


export default MainPage;
