import styled, { ThemeProvider } from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import Header from "../components/Header";
import UserRecommend from "../components/UserRecommend";
import MandaSimpleSearched from "../components/MandaSimpleSearched";
import Feed from "../components/Feed";
import componentTheme from "./../components/theme";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "./../config";
import { setSearchedUsers, setSearchedMandaSimples, setSearchedFeeds } from "../store/searchSlice";
import { setFeeds, clearFeeds } from "../store/feedSlice";

function SearchPage() {
  const dispatch = useDispatch();

  // 테마
  const colorTheme = useSelector((state) => state.theme.themes[state.theme.currentTheme]);
  const filterTheme = useSelector((state) => state.theme.filters[state.theme.currentTheme]);
  const theme = {
    color: colorTheme,
    filter: filterTheme,
    component: componentTheme,
  };

  // 상태
  const user = useSelector((state) => state.user);
  const search = useSelector((state) => state.search); // 검색 결과
  const searchKeyword = search.keyword; // 검색 키워드
  const [isMounted, setIsMounted] = useState(true);

  // 마운트 상태 설정
  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);

  // [UserRecommend] 상태
  const targetUsers = search.users; // 유저 검색 또는 추천 결과
  const [userPage, setUserPage] = useState(1); // 서버에 요청할 페이지 번호
  const [maxLoadedUserPage, setMaxLoadedUserPage] = useState(1); // 현재 로드된 최대 페이지 번호를 추적
  const [isUserScrolling, setIsUserScrolling] = useState(false); // 스크롤 중 상태
  const userScrollContainerRef = useRef(null);
  const [finalUserPageLoaded, setFinalUserPageLoaded] = useState(false);

  // [UserRecommend] 검색 결과 불러오기
  const getSearchedUsers = async (keyword, authToken, page) => {
    if (page === 1 && maxLoadedUserPage > 1) {
      return;
    }
    if (page !== 1 && page <= maxLoadedUserPage) {
      return;
    }
    if (finalUserPageLoaded == true) {
      console.log("더 이상 불러올 사용자 검색 결과가 없습니다.");
      return;
    }

    try {
      const response = await axios.get(`${BASE_URL}/user/search/?keyword=${keyword}&page=${page}`, {
        headers: {
          Authorization: `Token ${authToken}`,
        },
      });

      if (response.status === 200 && isMounted) {
        if (response.data.message === "No more pages") {
          setMaxLoadedUserPage(page);
          setFinalUserPageLoaded(true);
          return;
        }

        if (page === 1) {
          dispatch(setSearchedUsers(response.data));
        } else if (page !== 1) {
          dispatch(setSearchedUsers([...targetUsers, ...response.data]));
        }
      }

      // 최대 로드된 페이지 업데이트
      if (page > maxLoadedUserPage) {
        setMaxLoadedUserPage(page);
      }
    } catch (error) {
      console.log("유저 검색 중 오류 발생: ", error);
    }
  };

  // [UserRecommend] 마운트 시 유저 검색 요청
  useEffect(() => {
    if (isMounted && searchKeyword) {
      getSearchedUsers(searchKeyword, user.authToken, userPage);
    }
  }, [isMounted, searchKeyword, user.authToken, userPage]);

  // [UserRecommend] 검색 키워드 변경 시 페이지 초기화
  useEffect(() => {
    setUserPage(1);
    setFinalUserPageLoaded(false);
    dispatch(setSearchedUsers([]));
    setMaxLoadedUserPage(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [searchKeyword, dispatch]);

  // [UserRecommend] 스크롤 동작
  const handleScroll = () => {
    if (userScrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = userScrollContainerRef.current;
    }
  };

  useEffect(() => {
    const container = userScrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => {
        container.removeEventListener("scroll", handleScroll);
      };
    }
  }, []);

  // [UserRecommend] 이전 페이지로 이동
  const handlePrevClick = () => {
    if (isUserScrolling) return; // 스크롤 중이면 아무것도 하지 않음
    setIsUserScrolling(true); // 스크롤 시작

    setUserPage((prev) => (prev > 1 ? prev - 1 : prev));
    if (userScrollContainerRef.current) {
      userScrollContainerRef.current.scrollLeft -= 702;
    }

    setTimeout(() => {
      setIsUserScrolling(false);
    }, 500);
  };

  // [UserRecommend] 다음 페이지로 이동
  const handleNextClick = async () => {
    if (isUserScrolling) return;
    setIsUserScrolling(true);

    await getSearchedUsers(searchKeyword, user.authToken, userPage + 1);

    setUserPage((prev) => prev + 1);
    if (userScrollContainerRef.current) {
      userScrollContainerRef.current.scrollLeft += 702;
    }

    setTimeout(() => {
      setIsUserScrolling(false);
    }, 500);
  };

  // [MandaSimples] 상태
  const mandaSimples = search.manda_simples;
  const [mandaSimplePage, setMandaSimplePage] = useState(1); // 서버에 요청할 페이지 번호
  const [maxLoadedMandaSimplePage, setMaxLoadedMandaSimplePage] = useState(1); // 현재 로드된 최대 페이지 번호를 추적
  const [isMandaSimpleScrolling, setIsMandaSimpleScrolling] = useState(false); // 스크롤 중 상태
  const mandaSimpleScrollContainerRef = useRef(null);
  const [finalMandaSimplePageLoaded, setFinalMandaSimplePageLoaded] = useState(false);

  // [MandaSimples] 검색 결과 불러오기
  const getSearchedMandaSimples = async (keyword, authToken, page) => {
    if (page === 1 && maxLoadedMandaSimplePage > 1) {
      return;
    }
    if (page !== 1 && page <= maxLoadedMandaSimplePage) {
      return;
    }
    if (finalMandaSimplePageLoaded == true) {
      console.log("더 이상 불러올 만다라트 검색 결과가 없습니다.");
      return;
    }

    try {
      const response = await axios.get(
        `${BASE_URL}/manda/search/mandasimple/?keyword=${keyword}&page=${page}`,
        {
          headers: {
            Authorization: `Token ${authToken}`,
          },
        }
      );

      if (response.status === 200 && isMounted) {
        if (response.data.message === "No more pages") {
          setMaxLoadedMandaSimplePage(page);
          setFinalMandaSimplePageLoaded(true);
          return;
        }

        if (page === 1) {
          dispatch(setSearchedMandaSimples(response.data));
        } else if (page !== 1) {
          dispatch(setSearchedMandaSimples([...mandaSimples, ...response.data]));
        }
      }

      // 최대 로드된 페이지 업데이트
      if (page > maxLoadedMandaSimplePage) {
        setMaxLoadedMandaSimplePage(page);
      }
    } catch (error) {
      console.log("만다라트 검색 중 오류 발생: ", error);
    }
  };

  // [MandaSimples] 마운트 시 mandaSimple 검색 요청
  useEffect(() => {
    if (isMounted && searchKeyword) {
      getSearchedMandaSimples(searchKeyword, user.authToken, mandaSimplePage);
    }
  }, [isMounted, searchKeyword, user.authToken, mandaSimplePage]);

  // [MandaSimple] 검색 키워드 변경 시 페이지 초기화
  useEffect(() => {
    setMandaSimplePage(1);
    setFinalMandaSimplePageLoaded(false);
    dispatch(setSearchedMandaSimples([]));
    setMaxLoadedMandaSimplePage(1);
  }, [searchKeyword, dispatch]);

  // [MandaSimple] 스크롤 동작
  const handleMandaSimpleScroll = () => {
    if (mandaSimpleScrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = mandaSimpleScrollContainerRef.current;
    }
  };

  useEffect(() => {
    const container = mandaSimpleScrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleMandaSimpleScroll);
      return () => {
        container.removeEventListener("scroll", handleMandaSimpleScroll);
      };
    }
  }, []);

  // [MandaSimple] 이전 페이지로 이동
  const handleMandaSimplePrevClick = () => {
    if (isMandaSimpleScrolling) return; // 스크롤 중이면 아무것도 하지 않음
    setIsMandaSimpleScrolling(true); // 스크롤 시작

    setMandaSimplePage((prev) => (prev > 1 ? prev - 1 : prev));
    if (mandaSimpleScrollContainerRef.current) {
      mandaSimpleScrollContainerRef.current.scrollLeft -= 720;
    }

    setTimeout(() => {
      setIsMandaSimpleScrolling(false);
    }, 500);
  };

  // [MandaSimple] 다음 페이지로 이동
  const handleMandaSimpleNextClick = async () => {
    if (isMandaSimpleScrolling) return;
    setIsMandaSimpleScrolling(true);

    await getSearchedMandaSimples(searchKeyword, user.authToken, mandaSimplePage + 1);

    setMandaSimplePage((prev) => prev + 1);
    if (mandaSimpleScrollContainerRef.current) {
      mandaSimpleScrollContainerRef.current.scrollLeft += 720;
    }

    setTimeout(() => {
      setIsMandaSimpleScrolling(false);
    }, 500);
  };

  // [Feeds] 상태
  const feeds = useSelector((state) => state.feed.feeds); // 피드 상태
  const [feedsPage, setFeedsPage] = useState(1); // 서버에 요청할 페이지 번호
  const [isFeedLoaded, setIsFeedLoaded] = useState(false); // 피드 로드 상태
  const [hasMoreFeeds, setHasMoreFeeds] = useState(true); // 더 불러올 피드가 있는지
  const [show, setShow] = useState(false); // 피드 작성, 편집 모달 노출 상태
  const [feedMode, setFeedMode] = useState(""); // 피드 작성, 편집 모드 구분

  // [Feeds] 검색 결과 불러오기
  async function fetchSearchedFeeds(keyword, authToken, page) {
    if (!hasMoreFeeds) {
      return;
    } else {
      try {
        const response = await axios.get(
          `${BASE_URL}/feed/search/?keyword=${keyword}&page=${page}`,
          {
            headers: {
              Authorization: `Token ${authToken}`,
            },
          }
        );
        if (response.data.message === "No more pages") {
          setHasMoreFeeds(false);
          return;
        }

        if (response.status === 200 && isMounted) {
          if (feedsPage === 1) {
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

  // [Feeds] 마운트 시 검색된 피드 페이지 요청
  useEffect(() => {
    if (isMounted && searchKeyword) {
      fetchSearchedFeeds(searchKeyword, user.authToken, feedsPage).then(() => {
        setIsFeedLoaded(true);
      });
    }
  }, [isMounted, searchKeyword, user.authToken, feedsPage]);

  // [Feeds] 검색 키워드 변경 시 페이지 초기화
  useEffect(() => {
    setHasMoreFeeds(true);
    setFeedsPage(1);
    setIsFeedLoaded(false);
  }, [searchKeyword, dispatch]);

  // [Feeds] 피드 게시물 생성, 편집 모달
  const handleShow = () => setShow(true);

  // [Feeds] Intersection Observer 설정 (스크롤이 하단에 도달했을 때 감지)
  useEffect(() => {
    if (!isFeedLoaded || !hasMoreFeeds) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setFeedsPage((prevPage) => prevPage + 1); // 페이지 번호 증가
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

  // 각 섹션(만다라트, 게시물, 피드)의 참조
  const headerRef = useRef(null);
  const mandaSimplesRef = useRef(null);
  const usersRef = useRef(null);
  const feedsRef = useRef(null);

  // 스크롤 이동 함수
  const scrollToSection = (ref, headerRef) => {
    
    if (ref.current && headerRef.current) {
      const elementPosition = ref.current.getBoundingClientRect().top + window.scrollY;
      const headerHeight = headerRef.current.offsetHeight;

      window.scrollTo({
        top: elementPosition - headerHeight - 24, // Header의 높이만큼 빼서 스크롤
        behavior: "smooth",
      });
    }
  };

  // 스크롤 위치 감지 훅
  const useScrollspy = (refs, offset = 112) => {
    const [activeRef, setActiveRef] = useState(null);

    useEffect(() => {
      const listener = () => {
        const scroll = window.scrollY;

        const active = refs.find((ref) => {
          const element = ref.current;
          if (!element) return false;

          const rect = element.getBoundingClientRect();
          const top = Math.max(0, rect.top + scroll - offset);
          const bottom = rect.bottom + scroll - offset;

          return scroll >= top && scroll <= bottom;
        });

        setActiveRef(active || null);
      };

      window.addEventListener("scroll", listener);
      return () => {
        window.removeEventListener("scroll", listener);
      };
    }, [refs, offset]);

    return activeRef;
  };

  const activeSectionRef = useScrollspy([mandaSimplesRef, usersRef, feedsRef]);

  return (
    <ThemeProvider theme={theme}>
      <PageLayout>
        <Header ref={headerRef}></Header>
        <Body>
          <Stadardized>
            <Nav>
              <NavButton
                active={activeSectionRef === mandaSimplesRef}
                onClick={() => scrollToSection(mandaSimplesRef, headerRef)}
              >
                만다라트 검색 결과
              </NavButton>
              <NavButton
                active={activeSectionRef === usersRef}
                onClick={() => scrollToSection(usersRef, headerRef)}
              >
                사용자 검색 결과
              </NavButton>
              <NavButton
                active={activeSectionRef === feedsRef}
                onClick={() => scrollToSection(feedsRef, headerRef)}
              >
                게시물 검색 결과
              </NavButton>
            </Nav>
            <Article>
              <MandaSimplesWrapper ref={mandaSimplesRef}>
                <TitleWrapper>
                  <Title>
                    <Highlight>만다라트</Highlight> 검색 결과
                  </Title>
                </TitleWrapper>
                {mandaSimples.length > 0 && (
                  <>
                    <PrevButton
                      onClick={handleMandaSimplePrevClick}
                      src={process.env.PUBLIC_URL + "/icon/prev-image-btn.svg"}
                      top="44%"
                    />
                    <NextButton
                      onClick={handleMandaSimpleNextClick}
                      src={process.env.PUBLIC_URL + "/icon/next-image-btn.svg"}
                      top="44%"
                    />
                  </>
                )}
                <MandaSimples ref={mandaSimpleScrollContainerRef} length={mandaSimples.length}>
                  {mandaSimples.length > 0 ? (
                    mandaSimples.map((mandaSimple) => (
                      <MandaSimpleSearched key={mandaSimple.id} mandaSimple={mandaSimple} />
                    ))
                  ) : (
                    <NoResult>만다라트 검색 결과가 없습니다.</NoResult>
                  )}
                </MandaSimples>
              </MandaSimplesWrapper>

              <RecommendsWrapper ref={usersRef}>
                <TitleWrapper>
                  <Title>
                    <Highlight>사용자</Highlight> 검색 결과
                  </Title>
                </TitleWrapper>
                {targetUsers.length > 0 && (
                  <>
                    <PrevButton
                      onClick={handlePrevClick}
                      src={process.env.PUBLIC_URL + "/icon/prev-image-btn.svg"}
                      top="42.5%"
                    />
                    <NextButton
                      onClick={handleNextClick}
                      src={process.env.PUBLIC_URL + "/icon/next-image-btn.svg"}
                      top="42.5%"
                    />
                  </>
                )}
                <Recommends ref={userScrollContainerRef} length={targetUsers.length}>
                  {targetUsers.length > 0 ? (
                    targetUsers.map((targetUser) => (
                      <UserRecommend key={targetUser.id} targetUser={targetUser} />
                    ))
                  ) : (
                    <NoResult>사용자 검색 결과가 없습니다.</NoResult>
                  )}
                </Recommends>
              </RecommendsWrapper>

              <FeedsWrapper ref={feedsRef}>
                <TitleWrapper>
                  <Title>
                    <Highlight>게시물</Highlight> 검색 결과
                  </Title>
                </TitleWrapper>
                <Feeds>
                  {feeds.length > 0 ? (
                    <>
                      {feeds.map((feed, index) => (
                        <Feed
                          key={index}
                          id={`feed-${feed.feedInfo.id}`}
                          userInfo={feed.userInfo}
                          feedInfo={feed.feedInfo}
                          show={show}
                          setShow={setShow}
                          handleShow={handleShow}
                          feedMode={feedMode}
                          setFeedMode={setFeedMode}
                          currentPage={feedsPage}
                          fetchFeeds={fetchSearchedFeeds}
                        />
                      ))}
                      {!hasMoreFeeds && <NoResult>더 이상 불러올 게시물이 없습니다.</NoResult>}
                    </>
                  ) : (
                    <NoResult>게시물 검색 결과가 없습니다.</NoResult>
                  )}
                  <div id="feedEnd" /> {/* 스크롤 감지를 위한 요소 */}
                </Feeds>
              </FeedsWrapper>
            </Article>
            <Advertise>광고</Advertise>
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
  margin-top: 64px; // height of Header
`;

let Stadardized = styled.div`
  position: absolute;

  display: flex;
  justify-content: space-between;
  width: 1280px;
  gap: 24px;
  margin-top: 24px;
`;

const Nav = styled.nav`
  position: fixed;
  top: 88px;
  left: calc((100% - 1280px) / 2);

  width: 256px;
  height: fit-content;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.color.bg};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.color.border};
  overflow: hidden;
`;

let NavButton = styled.button`
  width: 100%;
  height: 56px;
  padding: 16px 24px;
  border: none;
  background: ${({ active, theme }) => (active ? theme.color.bg3 : "none")};
  
  font-size: 14px;
  font-weight: ${({ active }) => (active ? "bold" : "normal")};
  text-align: left;

  &:hover {
    font-weight: bold;
  }
`;

const Article = styled.article`
  width: 720px;
  margin-left: calc(256px + 24px);
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const Advertise = styled.aside`
  width: 256px;
  height: 500px;

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: ${({ theme }) => theme.color.bg};
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: 8px;
`;

const TitleWrapper = styled.div`
  padding-bottom: 12px;
  border-bottom: 1px solid ${({ theme }) => theme.color.border};
`;

const Title = styled.h1`
  color: ${({ theme }) => theme.color.font1};
  font-size: 16px;
  font-weight: 600;
  display: inline;
`;

const Highlight = styled(Title)`
  color: ${({ theme }) => theme.color.primary};
`;

const ScrollButton = styled.img`
  position: absolute;
  top: ${({ top }) => top};
  z-index: 99;
  width: 64px;
  height: 80px;

  background-color: ${({ theme }) => theme.color.font1};
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
  cursor: pointer;

  &:hover {
    border: 1px solid ${({ theme }) => theme.color.secondary};
  }
`;

const PrevButton = styled(ScrollButton)`
  border-radius: 8px;
  left: -16px;
`;

const NextButton = styled(ScrollButton)`
  border-radius: 8px;
  right: -16px;
`;

const MandaSimplesWrapper = styled.div`
  position: relative;
  width: 100%;
  padding: 16px;
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: 8px;
  background-color: ${({ theme }) => theme.color.bg};

  &:hover ${PrevButton}, &:hover ${NextButton} {
    opacity: 0.6;
    pointer-events: all;
  }
`;

const MandaSimples = styled.div`
  width: 100%;
  box-sizing: content-box;
  max-height: 742px; // 2 rows
  margin: 32px 0px 24px 0px;
  position: relative;

  display: flex;
  flex-direction: ${({ length }) => (length > 2 ? "column" : "row")};
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 16px;

  overflow-x: scroll;
  scroll-behavior: smooth;
  &::-webkit-scrollbar {
    height: 0px;
  }
`;

const NoResult = styled.div`
  width: 100%;
  height: 100px;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: ${({ theme }) => theme.color.font2};
`;

let HorizontalBorder = styled.hr`
  border: 1px solid ${({ theme }) => theme.color.border};
  width: 100%;
  margin: initial;
`;

let VerticalBorder = styled.hr`
  border: 1px solid ${({ theme }) => theme.color.border};
  width: 1;
  height: 100%;
  margin: initial;
`;

let Row = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  width: 100%;
  gap: 38px;
`;

let FeedsWrapper = styled.div`
  width: 100%;
  padding: 16px;
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: 8px;
  background-color: ${({ theme }) => theme.color.bg};
`;

let Feeds = styled.div`
  width: 100%;
  box-sizing: content-box;
  margin-top: 16px;

  display: flex;
  flex-direction: column;
  gap: 16px;
`;

let RecommendsWrapper = styled.div`
  position: relative;
  width: 100%;
  padding: 16px;
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: 8px;
  background-color: ${({ theme }) => theme.color.bg};

  &:hover ${PrevButton}, &:hover ${NextButton} {
    opacity: 0.6;
    pointer-events: all;
  }
`;

let Recommends = styled.div`
  width: 100%;
  box-sizing: content-box;
  max-height: 406px; // 3 rows
  margin: 32px 0px 24px 0px;
  position: relative;

  display: flex;
  flex-direction: ${({ length }) => (length > 4 ? "column" : "row")};
  flex-wrap: wrap;
  align-items: flex-start;
  row-gap: 32px;
  column-gap: 16px;

  overflow-x: scroll;
  scroll-behavior: smooth;
  &::-webkit-scrollbar {
    height: 0px;
  }
`;

export default SearchPage;
