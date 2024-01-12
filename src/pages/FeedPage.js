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
  const [recommUsers, setRecommUsers] = useState({}); // 추천 유저 상태
  const trendingUsers = recommUsers.trending_users;
  const familiarUsers = recommUsers.familiar_users;
  const activeUsers = recommUsers.active_users;
  const [show, setShow] = useState(false); // 피드 작성, 편집 모달 노출 상태
  const [feedMode, setFeedMode] = useState(""); // 피드 작성, 편집 모드 구분
  const selectedFeedId = useSelector((state) => state.selectedFeedId); // 선택된 피드 상태
  const [isMounted, setIsMounted] = useState(false);

  // 마운트 상태 설정
  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);

  // axios 요청 취소 인스턴스
  const axiosCancelSource = useRef(axios.CancelToken.source());

  // 피드 유형 선택
  useEffect(() => {
    async function fetchFeeds() {
      // 이전 요청 취소 및 새로운 취소토큰 생성
      axiosCancelSource.current.cancel("Previous request cancelled");
      axiosCancelSource.current = axios.CancelToken.source();

      if (activeTab === "마이") {
        fetchMyFeeds(user, currentPage, axiosCancelSource.current.token)
          .then(() => {
            setIsFeedLoaded(true);
          })
          .catch((error) => {
            if (!axios.isCancel(error)) {
              console.error("Error in feed loading: ", error); // 요청 중 오류 발생했을 때
            }
          });
      }
      if (activeTab === "전체") {
        fetchRecommendedFeeds(user, currentPage, axiosCancelSource.current.token)
          .then(() => {
            setIsFeedLoaded(true);
          })
          .catch((error) => {
            if (!axios.isCancel(error)) {
              console.error("Error in feed loading: ", error); // 요청 중 오류 발생했을 때
            }
          });
      }
    }

    fetchFeeds();
  }, [activeTab, user, currentPage]);

  // activeTab 변경 시 가장 상단으로 스크롤 이동
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeTab]);

  // 추천 피드 로드 후 선택된 피드가 있으면 불러옴
  useEffect(() => {
    if (activeTab === "전체" && selectedFeedId && feeds.length > 0) {
      fetchSelectedFeed(selectedFeedId, user);
    }
  }, [feeds, activeTab, selectedFeedId, user]);

  // 내 피드
  async function fetchMyFeeds(user, currentPage, cancelToken) {
    if (hasMoreFeeds === false) {
      return;
    } else if (hasMoreFeeds) {
      const response = await axios.get(
        `${BASE_URL}/feed/${user.userId}/?query=${user.userId}&page=${currentPage}`,
        {
          headers: {
            Authorization: `Token ${user.authToken}`,
          },
          cancelToken: cancelToken,
        }
      );

      if (response.data.message === "No more pages") {
        setHasMoreFeeds(false); // 더 이상 페이지가 없음
        return;
      }

      if (response.status === 200 && isMounted) {
        if (currentPage > 1) {
          dispatch(setFeeds([...feeds, ...response.data])); // 기존 피드에 추가
        } else {
          dispatch(setFeeds(response.data)); // 피드 초기화
        }
      }
    }
  }

  // 추천 피드 불러오기 (더 불러올 피드가 없을 경우 종료)
  async function fetchRecommendedFeeds(user, currentPage, cancelToken) {
    if (!hasMoreFeeds) {
      return;
    } else {
      const response = await axios.get(`${BASE_URL}/feed/recommend/?page=${currentPage}`, {
        headers: {
          Authorization: `Token ${user.authToken}`,
        },
        cancelToken: cancelToken,
      });

      if (response.data.message === "No more pages") {
        setHasMoreFeeds(false);
        return;
      }

      if (response.status === 200 && isMounted) {
        if (currentPage === 1) {
          dispatch(setFeeds(response.data));
        } else {
          dispatch(setFeeds([...feeds, ...response.data]));
        }
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

  // 피드 게시물 생성, 편집 모달
  const handleShow = () => setShow(true);

  // 추천 유저 조회 함수
  const fetchRecommendedUsers = async (authToken) => {
    try {
      const response = await axios.get(`${BASE_URL}/user/recommend/`, {
        headers: {
          Authorization: `Token ${authToken}`,
        },
      });

      if ((response.status === 200) & isMounted) {
        setRecommUsers(response.data);
      }
    } catch (error) {
      console.log("추천 유저 조회 중 오류 발생: ", error);
    }
  };

  // 마운트 시 추천 유저 조회
  useEffect(() => {
    if (isMounted) {
      fetchRecommendedUsers(user.authToken);
    }
  }, [isMounted, user.authToken]);

  return (
    <ThemeProvider theme={theme}>
      <PageLayout>
        <Header></Header>
        <Body>
          <Stadardized>
            <LeftSide>
              <Nav>
                <NavButton
                  active={activeTab === "전체"}
                  onClick={() => {
                    setIsFeedLoaded(false);
                    setCurrentPage(1);
                    setHasMoreFeeds(true);
                    setActiveTab("전체");
                    dispatch(setSelectedFeedId(null));
                  }}
                >
                  전체
                </NavButton>
                <NavButton
                  active={activeTab === "마이"}
                  onClick={async () => {
                    setIsFeedLoaded(false);
                    setCurrentPage(1);
                    setHasMoreFeeds(true);
                    setActiveTab("마이");
                    dispatch(setSelectedFeedId(null));
                  }}
                >
                  마이
                </NavButton>
              </Nav>
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
              {/* <Advertise>광고</Advertise> */}
            </LeftSide>
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
            <Aside>
              <RecommendsWrapper>
                <TitleWrapper>
                  <StyledText color={theme.color.font1} cursor="default">
                    최근 주목받는 사용자
                  </StyledText>
                </TitleWrapper>
                <Recommends>
                  {trendingUsers &&
                    trendingUsers.map((targetUser) => (
                      <UserRecommend key={targetUser.id} targetUser={targetUser} />
                    ))}
                </Recommends>
              </RecommendsWrapper>
              <RecommendsWrapper>
                <TitleWrapper>
                  <StyledText color={theme.color.font1} cursor="default">
                    알 수도 있는 사용자
                  </StyledText>
                </TitleWrapper>
                <Recommends>
                  {familiarUsers &&
                    familiarUsers.map((targetUser) => (
                      <UserRecommend key={targetUser.id} targetUser={targetUser} />
                    ))}
                </Recommends>
              </RecommendsWrapper>
              <RecommendsWrapper>
                <TitleWrapper>
                  <StyledText color={theme.color.font1} cursor="default">
                    최근 활동적인 사용자
                  </StyledText>
                </TitleWrapper>
                <Recommends>
                  {activeUsers &&
                    activeUsers.map((targetUser) => (
                      <UserRecommend key={targetUser.id} targetUser={targetUser} />
                    ))}
                </Recommends>
              </RecommendsWrapper>
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
  margin-top: 64px;
  /* flex-grow: 1; */
`;

let Stadardized = styled.div`
  display: flex;
  width: 1280px;
  gap: 24px;
  margin-top: 24px;
  margin-bottom: 80px;
`;

let LeftSide = styled.div`
  width: 224px;

  position: fixed;
  top: 88px;
  left: calc((100% - 1280px) / 2);

  display: flex;
  flex-direction: column;
  gap: 16px;
`;

let NavButton = styled.button`
  width: 100%;
  height: 56px;
  padding: 16px 24px;
  border: none;
  color: ${({ active, theme }) => (active ? theme.color.bg : theme.color.font1)};
  background: ${({ active, theme }) => (active ? theme.color.secondary : theme.color.bg)};

  font-size: 14px;
  font-weight: ${({ active }) => (active ? "bold" : "normal")};
  text-align: left;

  &:hover {
    font-weight: bold;
  }
`;

let FeedsNav = styled.div`
  width: 70%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

let Nav = styled.div`
  width: 100%;
  height: fit-content;
  display: flex;
  flex-direction: column;
  /* align-items: center;
  justify-content: space-between; */
  background-color: ${({ theme }) => theme.color.bg};
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: 8px;
  overflow: hidden;
  text-align: center;
`;

const Advertise = styled.aside`
  width: 224px;
  height: 500px;

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: ${({ theme }) => theme.color.bg};
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: 8px;
`;

let Feeds = styled.div`
  width: 720px;
  margin-left: calc(224px + 24px);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

let Aside = styled.aside`
  width: 288px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
`;

let RecommendsWrapper = styled.div`
  width: 100%;
  padding: 16px;
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: 8px;
  background-color: ${({ theme }) => theme.color.bg};

  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const TitleWrapper = styled.div`
  padding-bottom: 12px;
  border-bottom: 1px solid ${({ theme }) => theme.color.border};
`;

let StyledText = styled.span`
  width: 100%;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
  color: ${({ color }) => color};
  cursor: ${({ cursor = "pointer" }) => cursor};
`;

let StyledNavText = styled(StyledText)`
  width: 128px;
  line-height: 48px;
  border-radius: 8px;

  &:hover {
    background-color: ${({ theme }) => theme.color.bg3};
  }
`;

let Recommends = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
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
