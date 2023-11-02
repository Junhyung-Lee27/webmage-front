import axios from "axios";
import { useEffect, useState } from "react";
import styled, { ThemeProvider } from "styled-components";
import theme from "./theme";
import { useSelector } from "react-redux";
import MandaModal from "./MandaModal";

// 모달에 입력한 데이터를 가져오는 함수
// 캐시를 저장할 객체 생성
const dataCache = {};

async function fetchMandaData(mainId) {
  // 이미 캐시된 데이터가 있는지 확인
  if (dataCache[mainId]) {
    return dataCache[mainId];
  }

  try {
    const response = await axios.get(`http://15.164.217.203:8000/manda/mandasimple/${mainId}`);
    const data = response.data;

    // 데이터를 캐시에 저장
    dataCache[mainId] = data;

    return data;
  } catch (error) {
    console.error("데이터 가져오기 오류:", error);
    return null;
  }
}


function MandaWrite() {
  const currentTheme = useSelector((state) => state.theme.themes[state.theme.currentTheme]);

  const user = useSelector((state) => state.user);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mainId, setMainId] = useState(null);
  const [data, setData] = useState(null); // 데이터 상태 추가

  const [tableData, setTableData] = useState([
    [[[["", "", ""], ["", "", ""], ["", "", ""]], [["", "", ""], ["", "", ""], ["", "", ""]], [["", "", ""], ["", "", ""], ["", "", ""]]],
    [[["", "", ""], ["", "", ""], ["", "", ""]], [["", "", ""], ["", "", ""], ["", "", ""]], [["", "", ""], ["", "", ""], ["", "", ""]]],
    [[["", "", ""], ["", "", ""], ["", "", ""]], [["", "", ""], ["", "", ""], ["", "", ""]], [["", "", ""], ["", "", ""], ["", "", ""]]]],
  ]);

  const handleCellChange = (tableIndex, rowIndex, cellIndex, value) => {
    const updatedTableData = [...tableData];
    updatedTableData[tableIndex][rowIndex][cellIndex] = value;
    setTableData(updatedTableData);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleModalClose = (mainId) => {
    setIsModalOpen(false);
    setMainId(mainId); // main_id를 업데이트
  };

  useEffect(() => {
    if (handleModalClose && mainId) {
      // 모달이 열릴 때와 mainId가 변경될 때 데이터 가져오기
      fetchMandaData(mainId)
        .then((result) => {
          setData(result);
        });
    }
  }, [handleModalClose, mainId]);

    // Save 버튼을 눌렀을 때 호출되는 함수
    const saveData = async () => {
      try {
        const requestData = {
          contents: [],
        };
  
        // 테이블에 있는 데이터를 서버 요청에 맞게 변환하고 requestData에 추가
        Array.from({ length: 9 }, (_, tableIndex) => {
          Array.from({ length: 3 }, (_, rowIndex) => {
            Array.from({ length: 3 }, (_, cellIndex) => {
              const adjustedCellIndex = rowIndex * 3 + cellIndex;
              if (
                // 제외 조건 추가: tableIndex가 4가 아니며 rowIndex와 cellIndex가 1인 경우를 제외
                !(tableIndex !== 4 && rowIndex === 1 && cellIndex === 1)
              ) {
                const id = (mainId - 1) * 64 + adjustedCellIndex + 1;
                const content = tableData[rowIndex][cellIndex];
                const success_count = 0;
                requestData.contents.push({ id, content, success_count });
              }
            });
          });
        });
  
        // 서버로 데이터 전송
        const response = await axios.post('http://15.164.217.203:8000/manda/edit/content/', requestData);
        console.log('Data saved:', response.data);
  
        // 필요한 후속 작업 수행
      } catch (error) {
        console.error('오류 발생:', error);
        // 오류 처리 코드
      }
    };
    

  return (
    <div>
      <Manda>
        <div>
          <MandaModal isOpen={isModalOpen} onClose={handleModalClose} />
          <GridContainer>
            {Array.from({ length: 9 }, (_, tableIndex) => (
              <GridItem key={tableIndex}>
                <tbody>
                  {Array.from({ length: 3 }, (_, rowIndex) => (
                    <tr key={rowIndex}>
                      {Array.from({ length: 3 }, (_, cellIndex) => (
                        <td key={cellIndex}>
                          <TableCell
                            type="text"
                            maxLength="8"
                            value={
                              tableIndex === 4
                                ? rowIndex === 1 && cellIndex === 1
                                  ? data?.main_title
                                  : rowIndex === 0
                                  ? data?.subs[rowIndex * 3 + cellIndex]?.sub_title
                                  : rowIndex === 1 && cellIndex === 0
                                  ? data?.subs[rowIndex * 3 + cellIndex]?.sub_title
                                  : data?.subs[rowIndex * 3 + cellIndex - 1]?.sub_title
                                : tableIndex >= 0 && tableIndex <= 3
                                  ? rowIndex === 1 && cellIndex === 1
                                    ? data?.subs[tableIndex]?.sub_title
                                    : ''
                                  : tableIndex >= 5 && tableIndex <= 8
                                    ? rowIndex === 1 && cellIndex === 1
                                      ? data?.subs[tableIndex - 1]?.sub_title
                                      : ''
                                    : ''
                            }
                            disabled={
                              !(
                                (tableIndex !== 4 && !(rowIndex === 1 && cellIndex === 1)) 
                              )
                            }
                            onChange={(e) => handleCellChange(tableIndex, rowIndex, cellIndex, e.target.value)}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </GridItem>
            ))}
          </GridContainer>
        </div>

        <BtnGroup>
          <StartBtn onClick={openModal}>시작</StartBtn>
          <SaveBtn onClick={saveData}>저장</SaveBtn>
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
  width: 920px;
  height: 646px;
  margin-left: 198px;
  margin-top: -15px;
  border-radius: 8px;
  box-shadow: 0px 8px 24px 0px rgba(0, 0, 0, 0.15);
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

const TableCell = styled.input`
  text-align: center;
  vertical-align: middle;
  width: 100px;
  height: 70px;
  word-break: break-word;
  white-space: normal;
  padding: 0.5px;
  border: 1px solid #fff;
  background: rgba(114, 105, 255, 0.1);
  font-size: 12px;
`;

const BtnGroup = styled.div`
  display: flex;
  gap: 10px;
  border: none;
  flex-direction: column;
`;

const StartBtn = styled.button`
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

export default MandaWrite;
