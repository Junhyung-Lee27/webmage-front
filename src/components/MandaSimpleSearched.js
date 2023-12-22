import styled, { ThemeProvider } from "styled-components";
import componentTheme from "./theme";
import { useSelector } from "react-redux";
import FollowButton from "./FollowButton";
import { useState } from "react";

function MandaSimpleSearched({ mandaSimple }) {
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
  const [userInfo, setUserInfo] = useState({
    id: mandaSimple.userId,
    is_following: mandaSimple.is_following,
  });

  // 팔로우 처리
  const followOnUserRecommend = async () => {
    setUserInfo((prevUserInfo) => ({
      ...prevUserInfo,
      is_following: true,
    }));
  };

  // 언팔로우 처리
  const unfollowOnUserRecommend = async () => {
    setUserInfo((prevUserInfo) => ({
      ...prevUserInfo,
      is_following: false,
    }));
  };

  // Cell 내용을 결정하는 함수
  const getCellContent = (rowIndex, colIndex) => {
    if (rowIndex === 1 && colIndex === 1) {
      // 정중앙 셀
      return mandaSimple.mainTitle || "";
    } else {
      // 나머지 셀
      const cellIndex = rowIndex * 3 + colIndex - (rowIndex > 0 && colIndex > 1 ? 1 : 0);
      return mandaSimple.subs[cellIndex]?.subTitle || "";
    }
  };

  function truncateText(text, maxLength) {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  }

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <UserContainer>
          <Row>
          <StyledProfile
            src={
              mandaSimple.userImg instanceof File
                ? URL.createObjectURL(mandaSimple.userImg)
                : process.env.PUBLIC_URL + "/testImg/profile2.jpg"
            }
          />
          <Column>
            <StyledText size="16" weight="500" color={theme.color.font1}>
              {mandaSimple.username}
            </StyledText>
            <StyledText size="12" weight="400" color={theme.color.font2}>
              {mandaSimple.userPosition}
            </StyledText>
            <StyledText size="12" weight="400" color={theme.color.font2} margintop="auto">
              {mandaSimple.userHash}
            </StyledText>
          </Column>
        </Row>
        {user.userId !== mandaSimple.userId && (
          <FollowButtonWrapper>
            <FollowButton
              userInfo={userInfo}
              onFollow={() => followOnUserRecommend()}
              onUnfollow={() => unfollowOnUserRecommend()}
            />
          </FollowButtonWrapper>
        )}
        </UserContainer>
        <TableWrapper>
        <Table>
          {[...Array(3)].map((_, rowIndex) => (
            <TableRow key={rowIndex}>
              {[...Array(3)].map((_, colIndex) => (
                <TableCell key={rowIndex * 3 + colIndex}
                  rowIndex={rowIndex}
                  colIndex={colIndex}
                >
                  <TextWrapper>
                    {truncateText(getCellContent(rowIndex, colIndex), 38)}
                  </TextWrapper>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </Table>
        </TableWrapper>
      </Container>
    </ThemeProvider>
  );
}

const Container = styled.div`
  width: calc((1080px - 48px) / 3);
  display: flex;
  flex-direction: column;
  margin-right: 16px;
  background: ${({ theme }) => theme.color.bg};

  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: 8px;

  overflow: hidden;
`;

const TableWrapper = styled.div`
  border-top: 1px solid ${({ theme }) => theme.color.border};
  /* border-radius: 8px; */
  overflow: hidden;
  width: fit-content;
  height: fit-content;
`

const Table = styled.table`
  width: calc((1080px - 48px) / 3);
  height: 318px;
  table-layout: fixed; // 테이블 레이아웃 고정
`;

const TableRow = styled.tr`
  display: flex;
  width: 100%;
  height: calc(100% / 3);
`;

const TableCell = styled.td`
  /* layout */
  display: flex;
  align-items: center;
  width: calc(100% / 3); // 각 셀의 너비를 1/3로 설정
  height: 100%; // 각 셀의 높이를 1/3로 설정
  padding: 0.25rem;
  box-sizing: border-box;
  
  /* border */
  border-bottom: ${({ rowIndex, theme }) => (rowIndex === 0 || rowIndex === 1) ? `1px solid ${theme.color.border}` : 'none'};
  border-right: ${({ colIndex, theme }) => (colIndex === 0 || colIndex === 1) ? `1px solid ${theme.color.border}` : 'none'};

  /* etc */
  background: ${({ theme }) => theme.color.bg};
`;

const TextWrapper = styled.p`
  /* text description */
  text-align: center;
  overflow: hidden;
  line-height: 1.2em;
  max-height: 4.8em;
  word-wrap: break-word;
  white-space: normal;

  /* font */
  color: ${({ theme }) => theme.color.font1};
  font-size: 14px;
  font-weight: 400;

  /* etc */
  width: 100%;
`

const UserContainer = styled.div`
  position: relative;
  width: 100%;
  padding: 24px;
`;

const UserImg = styled.img`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  object-fit: cover;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Username = styled.h5`
  color: ${({ theme }) => theme.color.font1};
  font-size: 16px;
`;

const UserPosition = styled.span`
  color: ${({ theme }) => theme.color.font2};
  font-size: 14px;
  font-weight: 400;
`;

let Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 12px;
`;

let Column = styled.div`
  height: 56px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
`;
let StyledProfile = styled.img`
  width: 56px;
  height: 56px;
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: 50%;
  object-fit: cover;
`;
let StyledText = styled.span`
  font-size: ${({ size }) => size + "px"};
  font-weight: ${({ weight }) => weight};
  color: ${({ color }) => color};

  margin-top: ${({ margintop }) => margintop};
  cursor: ${({ cursor = "default" }) => cursor};
`;
const FollowButtonWrapper = styled.div`
  position: absolute;
  right: 20px;
  top: 20px;
`;

export default MandaSimpleSearched;
