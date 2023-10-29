import axios from "axios";
import { useEffect, useState } from "react";
import styled, { ThemeProvider, css } from "styled-components";
import theme from "./theme";
import { useSelector } from "react-redux";

function MandaWrite() {

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
    <div>
      <Manda>

        <GridContainer>
          {Array(9).fill().map((_, index) => (
            <GridItem key={index} isEven={(index + 1) % 2 === 0}>
            </GridItem>
          ))}
        </GridContainer>

        <GoalList>

          <Info>
            <div>이제 핵심 목표를 이루기 위한</div>
            <InfoLine2>
              <p style={{ color: '#6C63FF' }}>세부 목표</p>
              <p>를 작성해주세요</p>
            </InfoLine2>
          </Info>

          <ol>
            {goals.map((goal, index) => (
              <NumberedLi key={index}>
                <Number>{index + 1} </Number>
                <Input
                  type="text"
                  value={goal}
                  onChange={(e) => handleGoalChange(index, e.target.value)}
                />
              </NumberedLi>
            ))}
          </ol>

          <AiBtn>AI 추천</AiBtn>
          <BtnGroup>
            <DeleteBtn>삭제</DeleteBtn>
            <SaveBtn>저장</SaveBtn>
          </BtnGroup>

        </GoalList>
      </Manda>
    </div>
  );
}

const Manda = styled.div`
  display: flex; 
  gap: 25px; 
  margin-left: 198px;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  width: 720px;
  height: 630px;

  &:hover {
    cursor: pointer;
  }
`;

const GridItem = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #F9F8F5;
  ${(props) =>
    props.isEven ? 'background-color: #F1F1F1;' : 'background-color: white;'};
`;

const GoalList = styled.div`
  background: #FFFFFF;
  width: 402px;
  display: inline-flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
`

const Info = styled.div`
  width: 354px;
  color: #000;
  font-size: 18px;
  font-weight: 700;
  line-height: 20px;
  display: flex;
  flex-direction: column; 
  align-items: center;
  text-align: center;
  margin-top: 20px;
`

const InfoLine2 = styled.div`
  display: flex;
  margin-top: 5px;
`

const NumberedLi = styled.li`
  display: flex;
  align-items: center;
  line-height: 34px;
  margin-bottom: 18px;

  &:hover {
    cursor: pointer;
  }
`;

const Number = styled.span`
  width: 24px;
  font-size: 20px;
  font-weight: 500;
  color: #CACACA;

  &:hover {
    color: #222222;
  }
`;

const Input = styled.input`
  border: none;
  border-bottom: 1px solid #CACACA;
  outline: none;
  width: 325px;

  &:hover {
    border-bottom: 2px solid #222222;
  }
`;

const AiBtn = styled.button`
  width: 354px;
  height: 45px;
  border: 1px solid #6C63FF;
  border-radius: 4px;
  background: white;
  color: #6C63FF;
  font-size: 20px;
  font-weight: 500;
  cursor: pointer;
`

const BtnGroup = styled.div`
  display: flex;
  gap: 16px;
  border: none;
`

const DeleteBtn = styled.button`
  width: 90px;
  height: 42px;
  border-radius: 4px;
  border: none;
  background: #C31616;
  flex-shrink: 0;
  color: #FFF;
  justify-content: center;
  font-size: 20px;
  font-weight: 700;
  cursor: pointer;
`

const SaveBtn = styled.button`
  width: 248px;
  height: 42px;
  border-radius: 4px;
  border: none;
  background: #6C63FF;
  flex-shrink: 0;
  color: #FFF;
  justify-content: center;
  font-size: 20px;
  font-weight: 700;
  cursor: pointer;
`


export default MandaWrite;