import styled from "styled-components";
import { useSelector } from "react-redux";
import Header from "../components/Header";
import { useNavigate } from "react-router";
import MandaPart from "../components/MandaPart";

function MainPage() {
  const currentTheme = useSelector((state) => state.theme.themes[state.theme.currentTheme]);

  const subData = [ ['', '', ''], ['', '', ''], ['', '', ''] ];
  const mainData = [ ['', '', ''], ['', '코딩 왕', ''], ['', '', ''] ];

  let navigate = useNavigate();

  return (
    <PageLayout backgroundColor={currentTheme.bg2}>
      <Header></Header>
      <div>메인페이지 입니다.
        <button onClick={()=>{ navigate('/mandawrite') }}>만다라트 작성</button>
        <GridContainer>
          {Array(9).fill().map((_, index) => (
            <GridItem key={index} isEven={(index + 1) % 2 === 0}>
              <MandaPart data={index === 4 ? mainData : subData} />
            </GridItem>
          ))}
        </GridContainer>
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

let GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  margin: 20px;
  width: 720px;
  height: 630px;
`;

let GridItem = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  ${(props) =>
    props.isEven ? 'background-color: #F1F1F1;' : 'background-color: white;'};
`;

export default MainPage;
