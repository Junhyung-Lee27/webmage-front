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

  // 상태 관리
  const feeds = useSelector((state) => state.feed.feeds); // 피드 상태
  const [currentPage, setCurrentPage] = useState(1); // 피드 페이지네이션 번호
  const [isFeedLoaded, setIsFeedLoaded] = useState(false); // 피드 로드 상태
  const [hasMoreFeeds, setHasMoreFeeds] = useState(true); // 더 불러올 피드가 있는지
  const [activeTab, setActiveTab] = useState("마이"); // 활성화된 탭 (마이, 전체)
  const user = useSelector((state) => state.user); // 유저 상태
  const [recommUsers, setRecommUsers] = useState([]); // 추천 유저 상태
  const [followingStatus, setFollowingStatus] = useState({});
  let users = recommUsers;

  // 피드 정보 불러오기
  useEffect(() => {
    // 내 피드
    async function fetchMyFeeds(user, currentPage) {
      if (hasMoreFeeds === false) {
        return;
      } else if (hasMoreFeeds) {
        const response = await axios.get(
          `${BASE_URL}/feed/${user.userId}/?query=${user.userId}&page=${currentPage}`,
          {
            headers: {
              Authorization: `Token ${user.authToken}`,
            },
          }
        );
        if (response.data.message === "No more pages") {
          setHasMoreFeeds(false); // 더 이상 페이지가 없음
          return;
        }

        if (currentPage > 1) {
          dispatch(setFeeds([...feeds, ...response.data])); // 기존 피드에 추가
          console.log("my feeds loaded");
        } else {
          dispatch(setFeeds(response.data)); // 피드 초기화
        }
      }
    }

    // 추천 피드
    async function fetchRecommendedFeeds(user, currentPage) {
      if (hasMoreFeeds === false) {
        return;
      } else if (hasMoreFeeds) {
        const response = await axios.get(`${BASE_URL}/feed/recommend/?page=${currentPage}`, {
          headers: {
            Authorization: `Token ${user.authToken}`,
          },
        });
        if (response.data.message === "No more pages") {
          setHasMoreFeeds(false); // 더 이상 페이지가 없음
          return;
        }

        if (currentPage > 1) {
          dispatch(setFeeds([...feeds, ...response.data])); // 기존 피드에 추가
          console.log("recommended feeds loaded");
        } else {
          dispatch(setFeeds(response.data)); // 피드 초기화
        }
      }
    }

    if (activeTab === "마이") {
      fetchMyFeeds(user, currentPage).then(() => {
        setIsFeedLoaded(true);
      });
    }
    if (activeTab === "전체") {
      fetchRecommendedFeeds(user, currentPage).then(() => {
        setIsFeedLoaded(true);
      });
    }
  }, [activeTab, currentPage]);

  // Intersection Observer 설정 (스크롤이 하단에 도달했을 때 감지)
  useEffect(() => {
    if (!isFeedLoaded || !hasMoreFeeds) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setCurrentPage((prevPage) => prevPage + 1); // 페이지 번호 증가
          setIsFeedLoaded(false);
        }
      },
      { threshold: 1.0 }
    );

    // 관찰할 대상 요소 지정
    const target = document.getElementById("feedEnd");
    if (target) observer.observe(target);

    return () => {
      if (target) observer.unobserve(target); // 정리 작업
    };
  }, [isFeedLoaded === true]);

  // 팔로잉
  const updateFollowingStatus = (userId, isFollowing) => {
    setFollowingStatus((prevStatus) => ({ ...prevStatus, [userId]: isFollowing }));
  };

  // // 유저 데이터 불러오기
  // useEffect(() => {
  //   async function fetchUserData() {
  //     const response = await axios.get(`${BASE_URL}/search/users/`, {
  //       headers: {
  //         Authorization: `Token ${authToken}`, // 헤더에 토큰 추가
  //       },
  //       params: {
  //         query: userHash,
  //       },
  //     });
  //     setRecommUsers(response.data);
  //   }
  //   Promise.all([fetchUserData()]).then(() => {
  //     setLoading(false); // 데이터가 모두 로드되면 로딩 상태를 false로 설정
  //   });
  // }, []); // 빈 의존성 배열로 처음 마운트될 때 실행

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
                  onClick={() => {
                    setCurrentPage(1);
                    setHasMoreFeeds(true);
                    setActiveTab("마이");
                  }}
                >
                  마이
                </StyledText>
                <StyledText
                  color={activeTab === "전체" ? theme.color.font1 : theme.color.border}
                  onClick={() => {
                    setCurrentPage(1);
                    setHasMoreFeeds(true);
                    setActiveTab("전체");
                  }}
                >
                  전체
                </StyledText>
              </Nav>
              <Feeds>
                {feeds.map((feed) => (
                  <Feed
                    key={feed.feedInfo.id}
                    userInfo={feed.userInfo}
                    feedInfo={feed.feedInfo}
                    isFollowing={followingStatus[feed.userInfo.id]}
                    updateFollowingStatus={updateFollowingStatus}
                  />
                ))}
                {!hasMoreFeeds && <span>더 이상 불러올 게시물이 없습니다.</span>}
                <div id="feedEnd" /> {/* 스크롤 감지를 위한 요소 */}
              </Feeds>
            </FeedsNav>
            <Aside>
              <FeedWriteModal userId={user.userId} authToken={user.authToken} />
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
  height: 100%;
  background-color: ${({ theme }) => theme.color.bg2};
`;

let Body = styled.div`
  display: flex;
  align-content: space-between;
  justify-content: center;
  width: 100%;
  margin-top: 56px;
`;

let Stadardized = styled.div`
  display: flex;
  justify-content: space-between;
  width: 1080px;
  gap: 32px;
  margin-top: 16px;
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
  gap: 1rem;
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
