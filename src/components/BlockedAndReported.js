import styled, { ThemeProvider } from "styled-components";
import { useSelector } from "react-redux";
import componentTheme from "./theme";
import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../config";

function BlockedAndReported() {
  // 테마
  const colorTheme = useSelector((state) => state.theme.themes[state.theme.currentTheme]);
  const theme = {
    color: colorTheme,
    component: componentTheme,
  };

  // 상태관리
  const user = useSelector((state) => state.user);
  const [blockedUsers, setBlockedUsers] = useState([]); // 차단 유저
  const [reportedFeeds, setReportedFeeds] = useState([]); // 신고 게시물

  // 차단 유저, 게시물 불러오기
  useEffect(() => {
    getBlockedUsers(user);
    getReportedFeeds(user);
  }, [user]);

  async function getBlockedUsers(user) {
    try {
      const response = await axios.get(`${BASE_URL}/user/blocked_users/`, {
        headers: {
          Authorization: `Token ${user.authToken}`,
        },
      });
      setBlockedUsers(response.data);
    } catch (error) {
      console.error("차단 유저 불러오기 에러 : ", error);
    }
  }

  async function getReportedFeeds(user) {
    try {
      const response = await axios.get(`${BASE_URL}/feed/reported_feeds/`, {
        headers: {
          Authorization: `Token ${user.authToken}`,
        },
      });
      setReportedFeeds(response.data);
    } catch (error) {
      console.error("신고된 게시물 불러오기 에러 : ", error);
    }
  }

  // 유저 차단 해제
  async function unblockUser(blockedId, authToken) {
    try {
      await axios.delete(`${BASE_URL}/user/unblock/`, {
        data: { blocked_id: blockedId },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${authToken}`,
        },
      });
    } catch (error) {
      console.error(error.response.data);
    }
  }

  // 게시물 신고 취소
  async function unReportFeed(reportedId, authToken) {
    try {
      await axios.delete(`${BASE_URL}/feed/unreport/`, {
        data: { reported_id: reportedId },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${authToken}`,
        },
      });
    } catch (error) {
      console.error(error.response.data);
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <TablesContainer>
        <BlockedTable>
          <TableHead>
            <tr>
              <UserTableHeaderCell>유저명</UserTableHeaderCell>
              <UserTableHeaderCell>차단 일시</UserTableHeaderCell>
              <UserTableHeaderCell></UserTableHeaderCell>
            </tr>
          </TableHead>

          <tbody>
            {blockedUsers.length > 0 ? (
              blockedUsers.map((blocked_user) => (
                <UserContainer key={blocked_user.username + blocked_user.date}>
                  <UserTableCell>{blocked_user.username}</UserTableCell>
                  <UserTableCell>{blocked_user.blocked_at}</UserTableCell>
                  <UnblockBtnBox>
                    <UnblockBtn
                      onClick={() => {
                        unblockUser(blocked_user.id, user.authToken);
                        getBlockedUsers(user);
                      }}
                    >
                      차단 해제
                    </UnblockBtn>
                  </UnblockBtnBox>
                </UserContainer>
              ))
            ) : (
              <tr>
                <CenteredText colSpan="3" height="80px">
                  차단된 사용자가 없습니다.
                </CenteredText>
              </tr>
            )}
          </tbody>
        </BlockedTable>
        <ReportedTable>
          <TableHead>
            <tr>
              <FeedTableHeaderCell>유저명</FeedTableHeaderCell>
              <FeedTableHeaderCell>게시물 내용</FeedTableHeaderCell>
              <FeedTableHeaderCell>신고 사유</FeedTableHeaderCell>
              <FeedTableHeaderCell>신고 일시</FeedTableHeaderCell>
              <FeedTableHeaderCell></FeedTableHeaderCell>
            </tr>
          </TableHead>

          <tbody>
            {reportedFeeds.length > 0 ? (
              reportedFeeds.map((reported_feed) => (
                <FeedContainer key={reported_feed.id}>
                  <FeedTableCell>{reported_feed.username}</FeedTableCell>
                  <FeedTableCell>{reported_feed.feed_contents}</FeedTableCell>
                  <FeedTableCell>{reported_feed.reason}</FeedTableCell>
                  <FeedTableCell>{reported_feed.reported_at}</FeedTableCell>
                  <UnblockBtnBox>
                    <UnblockBtn
                      onClick={() => {
                        unReportFeed(reported_feed.id, user.authToken);
                        getReportedFeeds(user);
                      }}
                    >
                      신고 취소
                    </UnblockBtn>
                  </UnblockBtnBox>
                </FeedContainer>
              ))
            ) : (
              <tr>
                <CenteredText colSpan="5" height="80px">
                  신고한 게시물이 없습니다.
                </CenteredText>
              </tr>
            )}
          </tbody>
        </ReportedTable>
      </TablesContainer>
    </ThemeProvider>
  );
}

let TablesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
  width: 100%;
`;

let BlockedTable = styled.table`
  height: fit-content;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
`;

const ReportedTable = styled.table`
  height: fit-content;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
`;

let TableHead = styled.thead`
  height: 56px;
  width: 100%;
  border-bottom: 1px solid ${({ theme }) => theme.color.border};
`;

let TableHeaderCell = styled.th`
  font-size: 14px;
  text-align: center;
  line-height: 56px;
  font-weight: 600;
  color: ${({ theme }) => theme.color.font1};
  width: ${({ width }) => width};
  cursor: default;
`;

let UserTableHeaderCell = styled(TableHeaderCell)`
  width: 33%;
`;

let FeedTableHeaderCell = styled(TableHeaderCell)`
  width: 20%;
`;

let CenteredText = styled.td`
  font-size: 14px;
  text-align: center;
  line-height: 20px;
  padding: 16px 0px;
  color: ${({ theme }) => theme.color.font2};
  cursor: default;
  vertical-align: middle;
`;

let UserTableCell = styled(CenteredText)`
  width: 33%;
`;
let FeedTableCell = styled(CenteredText)`
  width: 20%;
`;

let UserContainer = styled.tr`
  width: 100%;
  border-bottom: 1px solid ${({ theme }) => theme.color.border};
`;

let FeedContainer = styled.tr`
  width: 100%;
  border-bottom: 1px solid ${({ theme }) => theme.color.border};
`;

let UnblockBtn = styled.button`
  /* width: 40%; */
  padding: 8px 24px;
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
  height: 100%;
  width: 100%;
  justify-content: center;
  align-items: center;
  vertical-align: middle;
`;

export default BlockedAndReported;
