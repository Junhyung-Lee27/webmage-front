import styled, { ThemeProvider } from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import Header from "../components/Header";
import UserRecommend from "../components/UserRecommend";
import Feed from "../components/Feed";
import componentTheme from "../components/theme";
import { useState, useEffect, useRef } from "react";
import { setFeeds, clearFeeds } from "../store/feedSlice";
import axios from "axios";
import { BASE_URL } from "./../config";
import FeedWriteModal from "../components/FeedWriteModal";
import FeedWriteButton from "../components/FeedWriteButton";
import { useLocation } from "react-router-dom";
import { setSelectedFeedId } from "../store/selectedFeedIdSlice";

function FeedPage() {
  let dispatch = useDispatch();
  const location = useLocation();
  const feedEndRef = useRef(null);

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
  const [activeTab, setActiveTab] = useState("전체"); // 활성화된 탭 (마이, 전체)
  const user = useSelector((state) => state.user); // 유저 상태
  const [recommUsers, setRecommUsers] = useState([]); // 추천 유저 상태
  const [followingStatus, setFollowingStatus] = useState({}); // 각 사용자에 대한 팔로우 상태
  const [show, setShow] = useState(false); // 피드 작성, 편집 모달 노출 상태
  const [feedMode, setFeedMode] = useState(""); // 피드 작성, 편집 모드 구분
  const selectedFeedId = useSelector((state) => state.selectedFeedId); // 선택된 피드 상태
  let users = recommUsers;

  // 추천 피드 로드
  useEffect(() => {
    async function fetchFeeds() {
      if (activeTab === "마이") {
        fetchMyFeeds(user, currentPage).then(() => {
          setIsFeedLoaded(true);
        });
      }
      if (activeTab === "전체") {
        await fetchRecommendedFeeds(user, currentPage);
      }
      setIsFeedLoaded(true);
    }

    fetchFeeds();
  }, [activeTab, user, currentPage]);

  // 추천 피드 로드 후 선택된 피드가 있으면 불러옴
  useEffect(() => {
    if (activeTab === "전체" && selectedFeedId && feeds.length > 0) {
      fetchSelectedFeed(selectedFeedId, user);
    }
  }, [feeds, activeTab, selectedFeedId, user]);

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

  // 추천 피드 불러오기 (더 불러올 피드가 없을 경우 종료)
  async function fetchRecommendedFeeds(user, currentPage) {
    if (!hasMoreFeeds) {
      return;
    } else {
      try {
        const response = await axios.get(`${BASE_URL}/feed/recommend/?page=${currentPage}`, {
          headers: {
            Authorization: `Token ${user.authToken}`,
          },
        });
        if (response.data.message === "No more pages") {
          setHasMoreFeeds(false);
          return;
        }
        if (response.status === 200) {
          if (currentPage === 1) {
            dispatch(setFeeds(response.data));
          } else {
            dispatch(setFeeds([...feeds, ...response.data]));
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
  }

  // 알림(notification)에서 선택된 피드 처리
  async function fetchSelectedFeed(selectedFeedId, user) {
    const selected_feed = await feeds.find((feed) => feed.feedInfo.id === selectedFeedId);

    if (selected_feed) {
      // 선택된 게시물이 feeds 목록에 있을 경우, 해당 위치로 스크롤 이동
      const feedElement = document.getElementById(`feed-${selectedFeedId}`);
      feedElement?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      // 선택된 게시물이 feeds 목록에 없을 경우, 선택된 게시물 정보 및 추천 피드 목록 불러와서 합침
      try {
        const response = await axios.get(`${BASE_URL}/feed/selected_feed/${selectedFeedId}`, {
          headers: {
            Authorization: `Token ${user.authToken}`,
          },
        });
        const selectedFeedData = response.data;
        dispatch(setFeeds([selectedFeedData, ...feeds]));

        // 페이지 가장 위쪽으로 스크롤 이동
        window.scrollTo(0, 0);
      } catch (error) {
        console.error("Error fetching selected feed:", error);
      }
    }
  }

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
  }, [isFeedLoaded && hasMoreFeeds]);

  // 팔로잉 (feeds 상태가 업데이트될 때마다 followingStatus 상태 업데이트)
  useEffect(() => {
    const newFollowingStatus = {};
    feeds.forEach((feed) => {
      const userId = feed.userInfo.id;
      const isFollowing = feed.userInfo.is_following;
      newFollowingStatus[userId] = isFollowing;
    });
    setFollowingStatus(newFollowingStatus);
  }, [feeds]);

  // 피드 게시물 생성, 편집 모달
  const handleShow = () => setShow(true);

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
                  onClick={async () => {
                    setHasMoreFeeds(true);
                    setCurrentPage(1);
                    setIsFeedLoaded(false);
                    setActiveTab("마이");
                    dispatch(setSelectedFeedId(null));
                  }}
                >
                  마이
                </StyledText>
                <StyledText
                  color={activeTab === "전체" ? theme.color.font1 : theme.color.border}
                  onClick={() => {
                    setHasMoreFeeds(true);
                    setCurrentPage(1);
                    setIsFeedLoaded(false);
                    setActiveTab("전체");
                    dispatch(setSelectedFeedId(null));
                  }}
                >
                  전체
                </StyledText>
              </Nav>
              <Feeds>
                {feeds.map((feed, index) => (
                  <Feed
                    id={`feed-${feed.feedInfo.id}`}
                    key={index}
                    userInfo={feed.userInfo}
                    feedInfo={feed.feedInfo}
                    show={show}
                    setShow={setShow}
                    handleShow={handleShow}
                    feedMode={feedMode}
                    setFeedMode={setFeedMode}
                    user={user}
                    currentPage={currentPage}
                    fetchFeeds={activeTab === "마이" ? fetchMyFeeds : fetchRecommendedFeeds}
                  />
                ))}
                {!hasMoreFeeds && <span>더 이상 불러올 게시물이 없습니다.</span>}
                <div id="feedEnd" /> {/* 스크롤 감지를 위한 요소 */}
              </Feeds>
            </FeedsNav>
            <Aside>
              <FeedWriteButton handleShow={handleShow} setFeedMode={setFeedMode} />
              {feedMode === "WRITE" && show === true && (
                <FeedWriteModal
                  show={show}
                  setShow={setShow}
                  userId={user.userId}
                  authToken={user.authToken}
                  feedMode={feedMode}
                  user={user}
                  currentPage={currentPage}
                  fetchFeeds={activeTab === "마이" ? fetchMyFeeds : fetchRecommendedFeeds}
                ></FeedWriteModal>
              )}
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
  /* flex-grow: 1; */
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
