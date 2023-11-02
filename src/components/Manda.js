import axios from "axios";
import { useEffect, useState } from "react";
import styled, { ThemeProvider } from "styled-components";
import theme from "./theme";
import { useSelector } from "react-redux";


function Manda() {

  const [main, setMain] = useState({});
  const [subs, setSubs] = useState([]);
  const [contents, setContents] = useState([]);

  const currentTheme = useSelector((state) => state.theme.themes[state.theme.currentTheme]);
  const currentFilter = useSelector((state) => state.theme.filters[state.theme.currentTheme]);

  useEffect(() => {
    
    axios.get("http://127.0.0.1:8000/manda/mandamain/17")
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
          <GridItem
          key={tableIndex}
          hasTopBorder={tableIndex < 3}
          hasLeftBorder={tableIndex % 3 === 0}
          hasRightBorder={tableIndex % 3 === 2}
          hasBottomBorder={tableIndex > 5}
          >
            <tbody>
              {Array.from({ length: 3 }, (_, rowIndex) => (
                <tr key={rowIndex}>
                  {Array.from({ length: 3 }, (_, cellIndex) => (
                    <TableCell key={cellIndex} centerIndex={cellIndex === 4}>
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
  border-collapse: collapse; /* 테이블 셀 간의 간격 제거 */
  border-top: ${(props) => (props.hasTopBorder ? 'none' : '1px solid #999')};
  border-left: ${(props) => (props.hasLeftBorder ? 'none' : '1px solid #999')};
  border-right: ${(props) => (props.hasRightBorder ? 'none' : '1px solid #999')};
  border-bottom: ${(props) => (props.hasBottomBorder ? 'none' : '1px solid #999')};
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

export default Manda;