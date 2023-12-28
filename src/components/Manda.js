import axios from "axios";
import { useEffect, useState } from "react";
import styled, { ThemeProvider } from "styled-components";
import componentTheme from "./theme";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "./../config";
import { resetMandaState, setSubs, setContents } from "../store/mandaSlice";

function Manda({ writeMode, setWriteMode, selectedSubIndex, setSelectedSubIndex, currPage }) {
  const dispatch = useDispatch();

  // 테마
  const colorTheme = useSelector((state) => state.theme.themes[state.theme.currentTheme]);
  const filterTheme = useSelector((state) => state.theme.filters[state.theme.currentTheme]);
  const theme = {
    color: colorTheme,
    filter: filterTheme,
    component: componentTheme,
  };

  // 상태관리
  const manda = useSelector((state) => state.manda);
  const main = manda.main;
  const subs = manda.subs;
  const contents = manda.contents;
  const user = useSelector((state) => state.user);

  // 데이터 로드 상태 관리
  const [dataLoaded, setDataLoaded] = useState(false);

  // 만다라트 구성에 필요한 데이터 불러오기
  useEffect(() => {
    const fetchData = async () => {
      if (main && main.id) {
        try {
          const response = await axios.get(`${BASE_URL}/manda/mandamain/${main.id}`, {
            headers: {
              Authorization: `Token ${user.authToken}`,
            },
          });

          dispatch(setSubs(response.data.subs));
          dispatch(setContents(response.data.contents));
          setDataLoaded(true);
        } catch (error) {
          console.error("manda 불러오기 에러 : ", error);
        }
      } else {
        // main.id가 존재하지 않는 경우 상태 초기화
        dispatch(resetMandaState());
      }
    };

    fetchData();
  }, [main && main.id]);

  // 현재 편집 중인 GridItem(3*3table)을 추적하는 상태
  const [editingIndex, setEditingIndex] = useState([1, 1]); // 초기 상태 = 세부 목표 작성

  // 각 GridItem의 클릭 이벤트핸들러
  const handleGridItemClick = (rowIndex, columnIndex) => {
    setEditingIndex([rowIndex, columnIndex]);

    // writeMode 상태 업데이트
    if (rowIndex === 1 && columnIndex === 1) {
      // 중앙 GridItem의 위치는 [1, 1]
      setWriteMode("SUB");
    } else {
      setWriteMode("CONTENT");
    }

    // 선택된 GridItem으로 index 상태 업데이트
    let index = rowIndex + columnIndex * 3;
    if (index != 4) {
      if (index >= 5) {
        index -= 1;
      }
      // sub_title이 비어있는 경우 가운데 테이블을 먼저 작성하도록 유도
      if (subs[index].sub_title === "" || subs[index].sub_title === null) {
        setEditingIndex([1, 1]);
        setWriteMode("SUB");
        alert("해당 위치의 세부목표를 먼저 작성해주세요!");
      }
    }
    setSelectedSubIndex(index);
  };

  // 9x9 테이블 생성
  const table = Array(9)
    .fill(null)
    .map(() => Array(9).fill(null));

  // 데이터 로드되기 전
  if (!dataLoaded) {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        table[i][j] = { mainTitle: "", subTitle: "", content: "" };
      }
    }
  }
  // 데이터 로드된 후
  else {
    // Main 배열 처리
    table[4][4] = { mainTitle: main ? main.main_title || "" : "" };

    // Subs 배열 처리
    const subsPositions = [
      [1, 1],
      [3, 3],
      [4, 1],
      [4, 3],
      [7, 1],
      [5, 3],
      [1, 4],
      [3, 4],
      [7, 4],
      [5, 4],
      [1, 7],
      [3, 5],
      [4, 7],
      [4, 5],
      [7, 7],
      [5, 5],
    ];

    subs.forEach((sub, index) => {
      const positionIndex = index * 2;
      const [firstX, firstY] = subsPositions[positionIndex];
      const [secondX, secondY] = subsPositions[positionIndex + 1];
      const subsColorPercentile = sub.color_percentile;
      table[firstX][firstY] = {
        subTitle: sub.sub_title || "",
        subsColorPercentile: subsColorPercentile,
      };
      table[secondX][secondY] = {
        subTitle: sub.sub_title || "",
        subsColorPercentile: subsColorPercentile,
      };
    });

    // Contents 배열 처리
    let contentIndex = 0;
    for (let i = 0; i < 9; i += 3) {
      for (let j = 0; j < 9; j += 3) {
        for (let k = i; k < i + 3; k++) {
          for (let l = j; l < j + 3; l++) {
            if (table[l][k] === null) {
              const contentData = contents[contentIndex++];
              const contentValue = contentData ? contentData.content : "";
              const contsColorPercentile = contentData ? contentData.color_percentile : 0;
              table[l][k] = { content: contentValue, contsColorPercentile: contsColorPercentile };
            }
          }
        }
      }
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <GridContainer>
        {[...Array(3)].map((_, gridColumnIndex) =>
          [...Array(3)].map((_, gridRowIndex) => {
            const isCenterTable = gridRowIndex === 1 && gridColumnIndex === 1; // 중앙 테이블 여부 확인
            const nowEditing =
              editingIndex[0] === gridRowIndex && editingIndex[1] === gridColumnIndex;

            const gridItemProps = {
              key: `${gridRowIndex}-${gridColumnIndex}`,
              isCenterTable,
              currPage,
              dataLoaded,
              onClick:
                currPage === "MAIN"
                  ? () => {}
                  : () => handleGridItemClick(gridRowIndex, gridColumnIndex),
            };

            if (currPage !== "MAIN") {
              gridItemProps.nowEditing = nowEditing;
            }

            return (
              <GridItem {...gridItemProps}>
                <tbody>
                  {[...Array(3)].map((_, cellIndex) => (
                    <tr key={cellIndex}>
                      {[...Array(3)].map((_, rowIndex) => {
                        const x = gridRowIndex * 3 + rowIndex;
                        const y = gridColumnIndex * 3 + cellIndex;
                        // 각 테이블의 중앙 셀 여부 확인
                        const isCenterCell = rowIndex === 1 && cellIndex === 1;
                        // 가운데 3x3 테이블이거나 각 테이블의 중앙 셀인 경우 isTitle을 true로 설정
                        const isTitle = isCenterTable && isCenterCell;
                        return (
                          <TableCell
                            key={`${cellIndex}-${rowIndex}`}
                            isCenterCell={isCenterCell}
                            isTitle={isTitle}
                            colorPercentile={
                              isCenterCell
                                ? table[x][y].subsColorPercentile
                                : table[x][y].contsColorPercentile
                            }
                          >
                            {table[x][y].mainTitle ||
                              table[x][y].subTitle ||
                              table[x][y].content ||
                              ""}
                          </TableCell>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </GridItem>
            );
          })
        )}
      </GridContainer>
    </ThemeProvider>
  );
}

const GridContainer = styled.div`
  display: inline-flex;
  flex-wrap: wrap;
  width: 720px;
  height: 628px;
  border-radius: 8px;
  /* box-shadow: 0px 8px 24px 0px rgba(0, 0, 0, 0.15); */
`;

const GridItem = styled.table`
  margin: 0;
  flex: 0 0 calc(33.3333% - 2px); /* 3개씩 가로로 배치, 2px는 border 두께 */
  box-sizing: content-box;
  table-layout: fixed;
  background: ${(props) => (props.isCenterTable ? `${props.theme.color.primary}50` : ``)};
  border-collapse: collapse; // 테이블 셀 간의 간격 제거
  
  /* 조건부 border 스타일 */
  border: ${(props) => {
    if (!props.dataLoaded) {
      return `2px solid ${props.theme.color.bg2}`; // 데이터가 로드되지 않았을 때는 border 없음
    } else {
      // 데이터가 로드되었을 때는 nowEditing에 따라 다른 border 적용
      return props.nowEditing
        ? `2px solid ${props.theme.color.primary}`
        : `2px solid ${props.theme.color.bg2}`;
    }
  }};

  /* 조건부 hover 스타일 */
  &:hover {
    border: ${(props) =>
      props.currPage === "MAIN"
        ? `2px solid ${props.theme.color.bg2}`
        : `2px solid ${props.theme.color.secondary}`};
  }

  /* 조건부 cursor 스타일 */
  cursor: ${(props) => (props.currPage === "MAIN" ? "default" : "pointer")};
`;

const TableCell = styled.td`
  text-align: center;
  vertical-align: middle;
  width: 84px;
  height: 68px;
  word-break: keep-all;
  padding: 0.5px;
  border: 1px solid ${({ theme }) => theme.color.bg};
  background: ${(props) => {
    if (props.isTitle) {
      return `${props.theme.color.primary}`;
    } else if (props.isCenterCell) {
      // mandaSubs color
      const opacity = props.colorPercentile ? Math.round(props.colorPercentile * 0.9) : 90;
      return `${props.theme.color.primary}${opacity}`;
    } else {
      // mandaContents color
      const opacity = props.colorPercentile ? Math.round(props.colorPercentile * 0.99) : 20;
      return `${props.theme.color.primary}${opacity}`;
    }
  }};
  color: ${({ theme }) => theme.color.font1};
  font-weight: ${(props) => (props.isTitle ? "600" : props.isCenterCell ? "600" : "500")};
  font-size: 12px;
`;

export default Manda;
