import axios from "axios";
import { useEffect, useState } from "react";
import styled from "styled-components";


function Manda() {

  const [main, setMain] = useState({});
  const [subs, setSubs] = useState([]);
  const [contents, setContents] = useState([]);

  useEffect(() => {
    
    axios.get("http://15.164.217.203:8000/manda/mandamain/3")
    .then((result) => {
      const data = result.data;
      setMain(data.main);
      setSubs(data.subs);
      
      // contents 8개씩 묶기
      const groupSize = 8;
      const contentsGroup = [];
      for (let i = 0; i < data.contents.length; i += groupSize) {
        contentsGroup.push(data.contents.slice(i, i + groupSize));
      }
      setContents(contentsGroup);
    })
    .catch(()=>{
      console.log('ajax 요청 실패');
    });
  }, []);

  // 특정 테이블의 cell을 가져오는 함수
  const getTableCell = (tableIndex, cellIndex) => {
    if (contents.length > tableIndex && contents[tableIndex].length >= cellIndex) {
      if (tableIndex === 4) {
        if (cellIndex === 4) {
          return main.main_title;
        } else {
          if ( cellIndex > 4) {
            const subIndex = cellIndex - 1;
            return subs[subIndex]?.sub_title || '';
          } else {
          const subIndex = cellIndex;
          return subs[subIndex]?.sub_title || '';
          }
        }
      } else {
        if (cellIndex === 4) {
          if (tableIndex  > 4) {
            return subs[tableIndex-1]?.sub_title
          }
          return subs[tableIndex]?.sub_title
        } else {
          const a = tableIndex > 4 ? tableIndex - 1 : tableIndex;
          const b = cellIndex > 4 ? cellIndex - 1 : cellIndex;
          const content = contents[a][b]?.content || '';
          return content;
        }
      }
    } else {
      if (tableIndex === 8) {
        if (cellIndex === 4) {
          return subs[7]?.sub_title || '';
        } else {
          const c = cellIndex > 4 ? cellIndex - 1 : cellIndex;
          return contents[7] && c < contents[7].length ? contents[7][c]?.content || '' : '';
        }
      } 
    }
    return ''; 
  };


  return (
    <div>
      <GridContainer>
        {Array.from({ length: 9 }, (_, tableIndex) => (
          <GridItem key={tableIndex}>
            <tbody>
              {Array.from({ length: 3 }, (_, rowIndex) => (
                <tr key={rowIndex}>
                  {Array.from({ length: 3 }, (_, cellIndex) => (
                    <TableCell key={cellIndex}>
                      {getTableCell(tableIndex, rowIndex * 3 + cellIndex)}
                    </TableCell>
                  ))}
                </tr>
              ))}
            </tbody>
          </GridItem>
        ))}
        </GridContainer>
    </div>
  );
}

const GridContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 720px;
  height: 630px;
`;

const GridItem = styled.table`
  border: 1px solid #ccc;
  margin: 0;
  flex: 0 0 calc(33.3333% - 2px); /* 3개씩 가로로 배치, 2px는 border 두께 */
  box-sizing: border-box;
  table-layout: fixed;
`;

const TableCell = styled.td`
  text-align: center;
  vertical-align: middle;
  border: 1px solid #ccc;
  width: 80px;
  height: 70px;
  word-break: keep-all;
`;

export default Manda;