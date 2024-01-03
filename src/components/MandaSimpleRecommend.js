import styled, { ThemeProvider } from "styled-components";
import componentTheme from "./theme";
import { useSelector } from "react-redux";

function MandaSimpleSearched({ mandaSimple, writeMode }) {
  // 테마
  const colorTheme = useSelector((state) => state.theme.themes[state.theme.currentTheme]);
  const filterTheme = useSelector((state) => state.theme.filters[state.theme.currentTheme]);
  const theme = {
    color: colorTheme,
    filter: filterTheme,
    component: componentTheme,
  };

  // 상태 관리
  const user = useSelector((state) => state.user);

  // Cell 내용을 결정하는 함수
  const getCellContent = (rowIndex, colIndex) => {
    // 1. 유사한 핵심목표에 대한 세부목표 표시
    if (writeMode === "SUB") {
      if (rowIndex === 1 && colIndex === 1) {
        // 정중앙 셀
        return mandaSimple.main_title || "";
      } else {
        // 나머지 셀
        const cellIndex = rowIndex * 3 + colIndex - (rowIndex > 0 && colIndex > 1 ? 1 : 0);
        // sub_mandas 배열의 길이를 확인하여 범위를 벗어난 경우 빈 문자열 반환
        return mandaSimple.sub_mandas && cellIndex < mandaSimple.sub_mandas.length
          ? mandaSimple.sub_mandas[cellIndex]?.sub_title || ""
          : "";
      }
    }
    // 2. 유사한 세부목표에 대한 실천방법 표시
    else if (writeMode === "CONTENT") {
      if (rowIndex === 1 && colIndex === 1) {
        // 정중앙 셀
        return mandaSimple.sub_title || "";
      } else {
        // 나머지 셀
        const cellIndex = rowIndex * 3 + colIndex - (rowIndex > 0 && colIndex > 1 ? 1 : 0);
        // contents 배열의 길이를 확인하여 범위를 벗어난 경우 빈 문자열 반환
        return mandaSimple.contents && cellIndex < mandaSimple.contents.length
          ? mandaSimple.contents[cellIndex]?.content || ""
          : "";
      }
    }
  };

  function truncateText(text, maxLength) {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  }

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <Table>
          {[...Array(3)].map((_, rowIndex) => (
            <TableRow key={rowIndex}>
              {[...Array(3)].map((_, colIndex) => (
                <TableCell key={rowIndex * 3 + colIndex} rowIndex={rowIndex} colIndex={colIndex}>
                  {truncateText(getCellContent(rowIndex, colIndex), 38)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </Table>
      </Container>
    </ThemeProvider>
  );
}

const Container = styled.div`
  width: calc((100% - (16px * 4)) / 5);
  height: 256px;

  background: ${({ theme }) => theme.color.bg};

  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: 8px;

  overflow: hidden;
`;

const Table = styled.table`
  width: 100%;
  height: 100%;
  table-layout: fixed; // 테이블 레이아웃 고정
`;

const TableRow = styled.tr``;

const TableCell = styled.td`
  // layout
  text-align: center;
  vertical-align: middle;
  width: calc(100% / 3);
  height: calc(100% / 3);
  padding: 0.25rem;
  /* border, background */
  border-bottom: ${({ rowIndex, theme }) =>
    rowIndex === 0 || rowIndex === 1 ? `1px solid ${theme.color.border}` : "none"};
  border-right: ${({ colIndex, theme }) =>
    colIndex === 0 || colIndex === 1 ? `1px solid ${theme.color.border}` : "none"};
  background: ${({ theme }) => theme.color.bg};

  // font
  color: ${({ theme }) => theme.color.font1};
  font-size: 12px;

  // 자동 줄바꿈
  white-space: normal; // 공백과 줄바꿈을 일반적으로 처리
  word-break: keep-all; // 단어 중간에 줄바꿈 방지
  overflow-wrap: break-word; // 단어가 너비 초과할 경우 줄바꿈
`;

export default MandaSimpleSearched;
