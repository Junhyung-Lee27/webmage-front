import { useState } from "react";
import { useSelector } from "react-redux";
import styled, { ThemeProvider } from "styled-components";
import axios from "axios";

function MandaModal({ isOpen, onClose }) {
  const user = useSelector((state) => state.user);

  console.log(user);

  const [tableData, setTableData] = useState([
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ]);

  const handleCellChange = (rowIndex, cellIndex, value) => {
    const updatedTableData = [...tableData];
    updatedTableData[rowIndex][cellIndex] = value;
    setTableData(updatedTableData);
  };

  const saveData = () => {  
    
  };
  
  const getPlaceholder = (cellIndex) => {
    if (cellIndex === 4) {
      return "핵심목표";
    } else {
      return cellIndex < 4 ? `세부목표 ${cellIndex + 1}` : `세부목표 ${cellIndex}`;
    }
  };

  return isOpen ? (
    <ModalWrapper>
      <ModalContent>
        <Title>
          <Info>핵심목표와 세부목표를 작성해주세요.</Info>
          <CloseBtn onClick={onClose}>X</CloseBtn>
        </Title>
        <Table>
          <tbody>
            {tableData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => {
                  const totalCellIndex = rowIndex * 3 + cellIndex; // 전체 테이블의 인덱스 계산
                  return (
                    <td key={totalCellIndex}>
                      <TableCell
                        type="text"
                        value={cell}
                        onChange={(e) => handleCellChange(rowIndex, cellIndex, e.target.value)}
                        placeholder={getPlaceholder(totalCellIndex)}
                        maxLength="10"
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </Table>
        <SaveBtn onClick={saveData}>저장</SaveBtn>
      </ModalContent>
    </ModalWrapper>
  ) : null;
}

const ModalWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  flex-shrink: 0;
`;

const ModalContent = styled.div`
  width: 800px;
  height: 574px;
  background: white;
  padding: 20px;
  z-index: 1000;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Title = styled.div`
  display: flex;
`;

const Info = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  text-align: center;
  font-size: 20px;
  font-weight: 700;
  margin: 10px -8px 20px 32px;
  width: 730px;
`;

const CloseBtn = styled.button`
  display: flex;
  border: none;
  background: inherit;
  font-size: 24px;
  font-weight: 600;
  cursor: pointer;
  color: #555555;
  width: 30px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  display: inline-flex;
  flex-wrap: wrap;
  justify-content: center;
`;

const TableCell = styled.input`
  text-align: center;
  vertical-align: middle;
  width: 200px;
  height: 140px;
  word-break: break-word;
  white-space: normal;
  padding: 0.5px;
  border: 1px solid #fff;
  background: rgba(114, 105, 255, 0.1);
`;

const SaveBtn = styled.button`
  border: none;
  border-radius: 8px;
  background: #6c63ff;
  width: 300px;
  height: 42px;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  text-align: center;
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  line-height: 40px;
  display: flex;
  margin-top: 20px;
`;

export default MandaModal;
