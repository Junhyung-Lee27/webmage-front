import styled from "styled-components";
import { useSelector } from "react-redux";
import Header from "../components/Header";
import { useNavigate } from "react-router";
import Manda from "../components/Manda";

function MainPage() {
  const currentTheme = useSelector((state) => state.theme.themes[state.theme.currentTheme]);

  let navigate = useNavigate();

  return (
    <PageLayout backgroundColor={currentTheme.bg2}>
      <Header></Header>
      <div>메인페이지 입니다.
        <button onClick={()=>{ navigate('/manda/write') }}>만다라트 작성</button>
        <Manda />
        
      </div>
      
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
