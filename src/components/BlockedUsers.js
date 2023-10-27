import styled, { ThemeProvider } from "styled-components";
import { useSelector } from "react-redux";
import componentTheme from "./theme";

function BlockedUsers() {
  const colorTheme = useSelector((state) => state.theme.themes[state.theme.currentTheme]);
  const combinedTheme = {
    color: colorTheme,
    component: componentTheme,
  };

  // 예시 데이터
  const users = [
    { username: "차단유저1", date: "2023.10.25" },
    { username: "차단유저2", date: "2023.10.24" },
    { username: "차단유저3", date: "2023.10.23" },
  ];

  return (
    <ThemeProvider theme={combinedTheme}>
      <BlockedTable>
        <TableHead>
          <tr>
            <TableHeaderCell>닉네임</TableHeaderCell>
            <TableHeaderCell>차단 일시</TableHeaderCell>
            <TableHeaderCell></TableHeaderCell>
          </tr>
        </TableHead>
        {users.map((user) => (
          <tbody>
            <UserContainer key={user.username + user.date}>
              <Username>{user.username}</Username>
              <BlockedDate>{user.date}</BlockedDate>
              <UnblockBtnBox>
                <UnblockBtn>차단 해제</UnblockBtn>
              </UnblockBtnBox>
            </UserContainer>
          </tbody>
        ))}
      </BlockedTable>
    </ThemeProvider>
  );
}

let BlockedTable = styled.table`
  height: fit-content;
  flex-grow: 1;
  margin-left: auto;
  margin-right: auto;
`;

let TableHead = styled.thead`
  height: 56px;
  width: 100%;
  border-bottom: 1px solid ${({ theme }) => theme.color.border};
`;

let CenteredText = styled.td`
  width: 33%;
  font-size: 14px;
  text-align: center;
  line-height: 56px;
  color: ${({ theme }) => theme.color.font1};
  cursor: default;
`;

let TableHeaderCell = styled.th`
  width: 33%;
  font-size: 14px;
  text-align: center;
  line-height: 56px;
  font-weight: 600;
  color: ${({ theme }) => theme.color.font1};
  cursor: default;
`;

let Username = styled(CenteredText)`
  color: ${({ theme }) => theme.font1};
`;

let BlockedDate = styled(CenteredText)`
  color: ${({ theme }) => theme.font1};
`;

let UserContainer = styled.tr`
  height: 56px;
  width: 100%;
  border-bottom: 1px solid ${({ theme }) => theme.color.border};
`;

let UnblockBtn = styled.button`
  width: 40%;
  padding: 8px 0px;
  text-align: center;
  font-size: 13px;
  font-weight: 600;
  line-height: 13px;
  color: ${({ theme }) => theme.color.primary};
  background-color: ${({ theme }) => theme.color.bg};
  border: 1px solid ${({ theme }) => theme.color.primary};
  border-radius: 4px;
  outline: none;
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.color.bg};
    background-color: ${({ theme }) => theme.color.primary};
  }
`;

let UnblockBtnBox = styled.td`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default BlockedUsers;
