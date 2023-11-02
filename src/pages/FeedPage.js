import styled, { ThemeProvider } from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import Header from "../components/Header";
import UserRecommend from "../components/UserRecommend";
import Feed from "../components/Feed";
import componentTheme from "../components/theme";
import { useState, useEffect } from "react";
import { setFeeds, clearFeeds } from "../store/feedSlice";
import axios from "axios";
import { BASE_URL } from "./../config";
import FeedWriteModal from "../components/FeedWriteModal";

function FeedPage() {
  let dispatch = useDispatch();

  const colorTheme = useSelector((state) => state.theme.themes[state.theme.currentTheme]);
  const filterTheme = useSelector((state) => state.theme.filters[state.theme.currentTheme]);
  const theme = {
    color: colorTheme,
    filter: filterTheme,
    component: componentTheme,
  };

  // 로딩 상태
  const [loading, setLoading] = useState(true);

  // 활성화된 탭을 추적하는 상태
  const [activeTab, setActiveTab] = useState("마이");

  // 피드 상태
  const feeds = useSelector((state) => state.feed.feeds);

  const user = useSelector((state) => state.user);
  const userId = user.userId;
  const authToken = user.authToken;
  const userHash = user.hash;

  // 추천 유저 상태
  const [recommUsers, setRecommUsers] = useState([]);
  let users = recommUsers;

  // 피드 정보 불러오기
  useEffect(() => {
    async function fetchFeedData() {
      const response = await axios.get(`${BASE_URL}/feed/${userId}`, {
        headers: {
          Authorization: `Token ${authToken}`, // 헤더에 토큰 추가
        },
      });
      dispatch(setFeeds(response.data));
    }

    async function fetchRecentFeeds() {
      const response = await axios.get(`${BASE_URL}/search/feeds`, {
        headers: {
          Authorization: `Token ${authToken}`, // 헤더에 토큰 추가
        },
        params: {
          query: "", // 공백으로 보내면 최근 생성된 피드 보내주도록 백엔드 구현되어 있음
        },
      });
      dispatch(setFeeds(response.data));
    }

    if (activeTab === "마이") {
      Promise.all([fetchFeedData()]).then(() => {
        setLoading(false); // 데이터가 모두 로드되면 로딩 상태를 false로 설정
      });
    }
    if (activeTab === "전체") {
      Promise.all([fetchRecentFeeds()]).then(() => {
        setLoading(false);
      });
    }
  }, [activeTab]); // activeTab 값이 변경될 때마다 useEffect 실행

  // 유저 데이터 불러오기
  useEffect(() => {
    async function fetchUserData() {
      const response = await axios.get(`${BASE_URL}/search/users/`, {
        headers: {
          Authorization: `Token ${authToken}`, // 헤더에 토큰 추가
        },
        params: {
          query: userHash,
        },
      });
      setRecommUsers(response.data);
    }
    Promise.all([fetchUserData()]).then(() => {
      setLoading(false); // 데이터가 모두 로드되면 로딩 상태를 false로 설정
    });
  }, []); // 빈 의존성 배열로 처음 마운트될 때 실행

  // 로딩 중 표시
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <ThemeProvider theme={theme}>
      <PageLayout>
        <Header></Header>
        <Body>
          <Stadardized>
            <FeedsNav>
              <Nav>
                <StyledText
                  color={activeTab === "마이" ? theme.color.font1 : theme.color.border}
                  onClick={() => setActiveTab("마이")}
                >
                  마이
                </StyledText>
                <StyledText
                  color={activeTab === "전체" ? theme.color.font1 : theme.color.border}
                  onClick={() => setActiveTab("전체")}
                >
                  전체
                </StyledText>
              </Nav>
              <Feeds>
                {feeds.map((feed) => (
                  <Feed
                    key={feed.contentInfo.id}
                    userInfo={feed.userInfo}
                    contentInfo={feed.contentInfo}
                  />
                ))}
              </Feeds>
            </FeedsNav>
            <Aside>
              <FeedWriteModal userId={userId} authToken={authToken} />
              <StyledText color={theme.color.font1} cursor="default">
                추천
              </StyledText>
              <Recommends>
                {users.map((user) => (
                  <UserRecommend key={user.id} user={user} />
                ))}
              </Recommends>
            </Aside>
          </Stadardized>
        </Body>
      </PageLayout>
    </ThemeProvider>
  );
}

let PageLayout = styled.div`
  ${({ theme }) => theme.component.font.importPretendard};
  font-family: Pretendard-Regular;
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: ${({ theme }) => theme.color.bg};
`;

let Body = styled.div`
  display: flex;
  align-content: space-between;
  justify-content: center;
  width: 100%;
`;

let Stadardized = styled.div`
  display: flex;
  justify-content: space-between;
  width: 1080px;
  gap: 32px;
  margin-top: 40px;
  margin-bottom: 80px;
`;

let FeedsNav = styled.div`
  width: 70%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

let Nav = styled.div`
  display: flex;
  gap: 1.5rem;
  /* margin-left: 3rem; */
`;

let Feeds = styled.div`
  width: 100%;
  /* margin: 32px 0px 0px -40px; */
  display: flex;
  flex-direction: column;
  align-items: center;
`;

let Aside = styled.aside`
  width: 30%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

let StyledText = styled.span`
  width: 100%;
  font-size: 1.1rem;
  font-weight: 700;
  color: ${({ color }) => color};
  cursor: ${({ cursor = "pointer" }) => cursor};
`;

let Recommends = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 8px;
`;

let StyledButton = styled.button`
  height: 42px;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  margin-top: 34px;
  margin-bottom: 32px;
  font-size: 16px;
  font-weight: 700;
  line-height: 20px;
  color: white;
  background-color: ${({ theme }) => theme.color.primary};
  border: 1px solid ${({ theme }) => theme.color.primary};
  border-radius: 8px;
  outline: none;
  cursor: pointer;
`;

export default FeedPage;
