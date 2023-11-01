import axios from "axios";
import { useEffect, useState } from "react";
import styled, { ThemeProvider } from "styled-components";
import theme from "./theme";
import { useSelector } from "react-redux";
import MandaModal from "./MandaModal";

function MandaWrite2() {
  const currentTheme = useSelector((state) => state.theme.themes[state.theme.currentTheme]);

  const user = useSelector((state) => state.user);

  console.log(user);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <Manda>
        <div>
          <StartBtn onClick={openModal}>시작하기</StartBtn>
          <MandaModal isOpen={isModalOpen} onClose={closeModal} />
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
        </div>

        <BtnGroup>
          <SaveBtn>저장</SaveBtn>
          <DeleteBtn>삭제</DeleteBtn>
        </BtnGroup>
      </Manda>
    </div>
  );
}

const Manda = styled.div`
  display: flex;
  gap: 20px;
  position: relative;
  flex-shrink: 0;
`;

const GridContainer = styled.div`
  display: inline-flex;
  flex-wrap: wrap;
  width: 900px;
  height: 630px;
  margin-left: 198px;
  margin-top: -15px;
  border-radius: 8px;
  box-shadow: 0px 8px 24px 0px rgba(0, 0, 0, 0.15);
  flex-shrink: 0;
  position: relative;
`;

const StartBtn = styled.div`
  width: 180px;
  height: 45px;
  cursor: pointer;
  background-color: #6c63ff;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 47%;
  left: 38.5%;
  transform: translateX(-50%);
  z-index: 1;
  flex-shrink: 0;
`;

const GridItem = styled.table`
  margin: 0;
  flex: 0 0 calc(33.3333% - 0px); /* 3개씩 가로로 배치, 0px는 border 두께 */
  box-sizing: border-box;
  table-layout: fixed;
  border-collapse: separate;
  border-spacing: 1px;
  border: 2px solid rgba(0, 0, 0, 0.15);
  flex-shrink: 0;
`;

const TableCell = styled.td`
  text-align: center;
  vertical-align: middle;
  width: 100px;
  height: 70px;
  word-break: keep-all;
  padding: 0.5px;
  border: 1px solid #fff;
  background: rgba(114, 105, 255, 0.1);
`;

const BtnGroup = styled.div`
  display: flex;
  gap: 10px;
  border: none;
  flex-direction: column;
`;

const SaveBtn = styled.button`
  width: 200px;
  height: 42px;
  border-radius: 4px;
  border: none;
  background: #6c63ff;
  flex-shrink: 0;
  color: #fff;
  justify-content: center;
  font-size: 20px;
  font-weight: 700;
  cursor: pointer;
  margin-left: 10px;
`;

const DeleteBtn = styled.button`
  width: 200px;
  height: 42px;
  border-radius: 4px;
  border: none;
  background: #c31616;
  flex-shrink: 0;
  color: #fff;
  justify-content: center;
  font-size: 20px;
  font-weight: 700;
  cursor: pointer;
  margin-left: 10px;
`;

export default MandaWrite2;
