import { useState } from "react";
import { useSelector } from "react-redux";
import styled, { ThemeProvider } from "styled-components";
import axios from "axios";

function MandaModal ({ isOpen, onClose }) {

  const user = useSelector((state) => state.user);

  console.log(user);

  const [tableData, setTableData] = useState([
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
  ]);

  const handleCellChange = (rowIndex, cellIndex, value) => {
    const updatedTableData = [...tableData];
    updatedTableData[rowIndex][cellIndex] = value;
    setTableData(updatedTableData);
  };

  const saveData = () => {
    const requestDataCreate = {
      user: 54,
      main_title: tableData[1][1],
      success: false,
    };
  
    // 인증 토큰을 헤더에 추가
    const headers = {
      Authorization: 'Bearer ' + user.token, // 사용자의 토큰을 넣어주세요
    };
  
    axios.post('http://15.164.217.203:8000/manda/create', requestDataCreate, { headers })
      .then((response) => {
        console.log(response.data);
        // POST 요청이 성공하면 다음 POST 요청을 보냅니다.
        return Promise.all(tableData.map((row, rowIndex) => {
          return Promise.all(row.map((cell, cellIndex) => {
            if (cellIndex !== 4) {
              const main_id = 7;
              const id = main_id * 10 + (cellIndex < 4 ? 3 : 2) + cellIndex;
              const sub_title = cell;
  
              const requestDataEdit = {
                subs: [{ id, main_id, success: false, sub_title }],
              };
  
              // 인증 토큰을 헤더에 추가
              const headers = {
                Authorization: 'Bearer ' + user.token, // 사용자의 토큰을 넣어주세요
              };
  
              return axios.post('http://15.164.217.203:8000/manda/edit/sub', requestDataEdit, { headers });
            }
          }));
        }));
      })
      .then((responses) => {
        console.log(responses);
        // 모든 POST 요청이 성공하면 실행할 코드
      })
      .catch((error) => {
        console.error(error);
        // 요청이 실패한 경우 실행할 코드
      });
  };

  const getPlaceholder = (cellIndex) => {
    if (cellIndex === 4) {
      return '핵심목표';
    } else {
      return (cellIndex < 4) ? `세부목표 ${cellIndex + 1}` : `세부목표 ${cellIndex}`;
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
`

const Info = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  text-align: center;
  font-size: 20px;
  font-weight: 700;
  margin: 10px -8px 20px 32px;
  width: 730px;
`

const CloseBtn = styled.button`
  display: flex;
  border: none;
  background: inherit;
  font-size: 24px;
  font-weight: 600;
  cursor: pointer;
  color: #555555;
  width: 30px;
`

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
  border: 1px solid #FFF;
  background: rgba(114, 105, 255, 0.1);
`

const SaveBtn = styled.button`
  border: none;
  border-radius: 8px;
  background: #6C63FF;
  width: 300px;
  height: 42px;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  text-align: center;
  color: #FFF;
  font-size: 16px;
  font-weight: 700;
  line-height: 40px;
  display: flex;
  margin-top: 20px;
`



export default MandaModal;