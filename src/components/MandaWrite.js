import axios from "axios";
import { useEffect, useState } from "react";
import styled, { ThemeProvider } from "styled-components";
import theme from "./theme";
import { useSelector } from "react-redux";


function MandaWrite() {

  const currentTheme = useSelector((state) => state.theme.themes[state.theme.currentTheme]);

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
          {Array.from({ length: 9 }, (_, tableIndex) => (
            <GridItem key={tableIndex}>
              <tbody>
                {Array.from({ length: 3 }, (_, rowIndex) => (
                  <tr key={rowIndex}>
                    {Array.from({ length: 3 }, (_, cellIndex) => (
                      <TableCell key={cellIndex} centerIndex={cellIndex === 4}>
                        {/* {getTableCell(tableIndex, rowIndex * 3 + cellIndex)} */}
                      </TableCell>
                    ))}
                  </tr>
                ))}
              </tbody>
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
`;

const GridContainer = styled.div`
  display: inline-flex;
  flex-wrap: wrap;
  width: 774px;
  height: 648px;
  margin-left: 198px;
  margin-top: 5px;
  border-radius: 8px;
  box-shadow: 0px 8px 24px 0px rgba(0, 0, 0, 0.15);
`;

const GridItem = styled.table`
  margin: 0;
  flex: 0 0 calc(33.3333% - 0px); /* 3개씩 가로로 배치, 0px는 border 두께 */
  box-sizing: border-box;
  table-layout: fixed;
  border-collapse: separate; 
  border-spacing: 1px;
`;

const TableCell = styled.td`
  text-align: center;
  vertical-align: middle;
  width: 86px;
  height: 70px;
  word-break: keep-all;
  padding: 0.5px;
  border: 1px solid #FFF;
  background: ${(props) => 
    (props.centerIndex ? 'rgba(114, 105, 255, 1)' : 'rgba(114, 105, 255, 0.1)')};
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