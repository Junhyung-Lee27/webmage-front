import styled from "styled-components";
import { useSelector } from "react-redux";
import Header from "../components/Header";
import MandaPart from "../components/MandaPart";
import { useState } from "react";

function MandaWritePage() {
  const currentTheme = useSelector((state) => state.theme.themes[state.theme.currentTheme]);

  const subData = [ ['', '', ''], ['', '', ''], ['', '', ''] ];
  const mainData = [ ['', '', ''], ['', '코딩 왕', ''], ['', '', ''] ];

  const [goals, setGoals] = useState(Array(8).fill(''));

  const handleGoalChange = (index, value) => {
    const updatedGoals = [...goals];
    updatedGoals[index] = value;
    setGoals(updatedGoals);
  };

  return (
    <PageLayout backgroundColor={currentTheme.bg2}>
      <Header></Header>
      <Manda>
        <GridContainer>
          {Array(9).fill().map((_, index) => (
            <GridItem key={index} isEven={(index + 1) % 2 === 0}>
              <MandaPart data={index === 4 ? mainData : subData} />
            </GridItem>
          ))}
        </GridContainer>
        <GoalList>이제 핵심 목표를 이루기 위한 세부 목표를 작성해주세요
          <ol>
            {goals.map((goal, index) => (
              <li key={index}>
                <input
                  type="text"
                  value={goal}
                  onChange={(e) => handleGoalChange(index, e.target.value)}
                />
              </li>
            ))}
          </ol>
          <button>삭제</button>
          <button>저장</button>
        </GoalList>
      </Manda>
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

let Manda = styled.div`
  display: flex; 
  gap: 40px; 
  margin: 20px;
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

let GoalList = styled.div`
  background: #FFFFFF;
`


export default MandaWritePage;
