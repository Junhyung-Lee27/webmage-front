import axios from "axios";
import { useEffect, useState } from "react";
import styled, { ThemeProvider } from "styled-components";
import componentTheme from "./theme";
import { useSelector } from "react-redux";


function MandaSimple({ axiosURL }) {

  // 테마
  const colorTheme = useSelector((state) => state.theme.themes[state.theme.currentTheme]);
  const filterTheme = useSelector((state) => state.theme.filters[state.theme.currentTheme]);

  const theme = {
    color: colorTheme,
    filter: filterTheme,
    component: componentTheme,
  };


  const [main, setMain] = useState({});
  const [subs, setSubs] = useState([]);

  useEffect(() => {
    
    axios.get(axiosURL)
    .then((result) => {
      const data = result.data;
      setMain(data.main);
      setSubs(data.subs);
    })
    .catch(()=>{
      console.log('ajax 요청 실패');
    });
  }, [axiosURL]);

  const getTableCell = (cellIndex) => {
    if (cellIndex === 4) {
      return main.main_title;
    } else {
      return subs[cellIndex - (cellIndex > 4 ? 1 : 0)]?.sub_title || '';
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <Table>
          <tbody>
            {Array.from({ length: 3 }, (_, rowIndex) => (
              <tr key={rowIndex}>
                {Array.from({ length: 3 }, (_, cellIndex) => (
                  <TableCell key={cellIndex}>
                    {getTableCell(rowIndex * 3 + cellIndex)}
                  </TableCell>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
        <UserContainer>
          <UserImg src={process.env.PUBLIC_URL + "/testImg/profile1.jpg"}></UserImg>
          <UserInfo>
            <Username>username</Username>
            <UserPosition>userposition</UserPosition>
          </UserInfo>
        </UserContainer>
      </Container>
    </ThemeProvider>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-bottom: 48px;
`

const Table = styled.table`
  width: 256px;
  height: 256px;
  margin: 0;
  flex: 0 0 calc(33.3333% - 0px); /* 3개씩 가로로 배치, 0px는 border 두께 */
  box-sizing: border-box;
  flex-shrink: 0;
  table-layout: fixed;
  border-collapse: separate;
  border-spacing: 2px;
  box-shadow: 0px 8px 24px 0px rgba(0, 0, 0, 0.15);
  background: rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: row;
`

const TableCell = styled.td`
  text-align: center;
  vertical-align: middle;
  width: 84px;
  height: 84px;
  flex-shrink: 0;
  word-break: keep-all;
  padding: 0.5px;
  background: ${({ theme }) => theme.color.bg};
  color: ${({ theme }) => theme.color.font1};
  font-size: 14px;
  font-weight: 400;
  line-height: normal;
`;

const UserContainer = styled.div`
  width: 256px;
  height: 64px;
  display: flex;
  align-items: center;
  gap: 16px;
`

const UserImg = styled.img`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  object-fit: cover;
`

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const Username = styled.h5`
  color: ${({ theme }) => theme.color.font1};
  font-size: 16px;
`

const UserPosition = styled.span`
  color: ${({ theme }) => theme.color.font2};
  font-size: 16px;
  font-weight: 400;
`

export default MandaSimple;