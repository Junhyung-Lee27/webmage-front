import styled, { ThemeProvider } from "styled-components";
import { useSelector } from "react-redux";
import componentTheme from "./theme";

function Notification() {
  const colorTheme = useSelector((state) => state.theme.themes[state.theme.currentTheme]);
  const filterTheme = useSelector((state) => state.theme.filters[state.theme.currentTheme]);
  const theme = {
    color: colorTheme,
    filter: filterTheme,
    component: componentTheme,
  };

  return (
    <ThemeProvider theme={theme}>
      <NotiLayout>
        <NotiContainer>
          <NotiTitle>알림</NotiTitle>
          <NotiList>
            <NotiBox>
              <ProfileImg src={process.env.PUBLIC_URL + "/testImg/profile1.jpg"} />
              <Contents>
                <Username>오르미</Username>
                님이 회원님을 팔로우합니다.
                <ReceivedAt>3일 전</ReceivedAt>
              </Contents>
            </NotiBox>
            <NotiBox>
              <ProfileImg src={process.env.PUBLIC_URL + "/testImg/profile2.jpg"} />
              <Contents>
                <Username>웹법사</Username>
                님이 회원님의 게시글에 댓글을 남겼습니다.
                <ReceivedAt>3일 전</ReceivedAt>
              </Contents>
            </NotiBox>
            <NotiBox>
              <ProfileImg src={process.env.PUBLIC_URL + "/testImg/profile2.jpg"} />
              <Contents>
                <Username>웹법사</Username>
                님이 회원님의 게시글에 공감합니다.
                <ReceivedAt>3일 전</ReceivedAt>
              </Contents>
            </NotiBox>
            <NotiBox>
              <ProfileImg src={process.env.PUBLIC_URL + "/testImg/profile2.jpg"} />
              <Contents>
                <Username>웹법사</Username>
                님이 회원님의 게시글에 공감합니다.
                <ReceivedAt>3일 전</ReceivedAt>
              </Contents>
            </NotiBox>
            <NotiBox>
              <ProfileImg src={process.env.PUBLIC_URL + "/testImg/profile2.jpg"} />
              <Contents>
                <Username>웹법사</Username>
                님이 회원님의 게시글에 공감합니다.
                <ReceivedAt>3일 전</ReceivedAt>
              </Contents>
            </NotiBox>
            <NotiBox>
              <ProfileImg src={process.env.PUBLIC_URL + "/testImg/profile2.jpg"} />
              <Contents>
                <Username>웹법사</Username>
                님이 회원님의 게시글에 공감합니다.
                <ReceivedAt>3일 전</ReceivedAt>
              </Contents>
            </NotiBox>
          </NotiList>
        </NotiContainer>
      </NotiLayout>
    </ThemeProvider>
  );
}

let NotiLayout = styled.div`
  // 아이콘 하단, 가운데 정렬
  position: absolute;
  top: calc(100% + 24px);

  // 기타 스타일링
  width: fit-content;
  height: fit-content;
  background-color: ${({ theme }) => theme.color.bg};
  border-radius: 16px;
  box-shadow: 0 8px 24px 0px rgba(0, 0, 0, 0.15);
`;

let NotiContainer = styled.div`
  position: relative;
  width: 360px;

  &::before {
    content: "";
    position: absolute;
    top: -10px;
    left: 50%;
    transform: translate(-50%);
    width: 0;
    height: 0;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-bottom: 10px solid ${({ theme }) => theme.color.bg};
  }
`;

let NotiTitle = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.color.border};
  height: 40px;
  line-height: 40px;
  padding-left: 24px;
  color: ${({ theme }) => theme.color.font1};
  font-weight: 600;
`;

let NotiList = styled.div`
  display: flex;
  flex-direction: column;
  max-height: 320px;
  overflow-y: scroll;

  /* 스크롤바 */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &:hover {
    &::-webkit-scrollbar-thumb {
      background: ${({ theme }) => theme.color.bg3};
    }
  }
`;

let NotiBox = styled.div`
  padding: 16px 24px;
  display: flex;
  gap: 8px;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.color.bg3};
  }
`;

let ProfileImg = styled.img`
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 50%;
`;

let Contents = styled.span`
  font-size: 14px;
  height: 40px;
  line-height: 20px;
  color: ${({ theme }) => theme.color.font1};
`;

let Username = styled.span`
  font-weight: bold;
  width: max-content;
`;

let ReceivedAt = styled.span`
  margin-left: 6px;
  font-size: 13px;
  color: ${({ theme }) => theme.color.font2};
`;


export default Notification;
