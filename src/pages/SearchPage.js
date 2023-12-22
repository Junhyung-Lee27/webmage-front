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
import { setSearchedUsers, setSearchedMandaSimples } from "../store/searchSlice";

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

  // [UserRecommend] 상태
  const targetUsers = search.users; // 유저 검색 또는 추천 결과
  const [userPage, setUserPage] = useState(1); // 서버에 요청할 페이지 번호
  const [maxLoadedUserPage, setMaxLoadedUserPage] = useState(1); // 현재 로드된 최대 페이지 번호를 추적
  const [isUserScrolling, setIsUserScrolling] = useState(false); // 스크롤 중 상태
  const userScrollContainerRef = useRef(null);
  const [showUserPrevButton, setShowUserPrevButton] = useState(false);
  const [showUserNextButton, setShowUserNextButton] = useState(true);

  // [UserRecommend] 검색 결과 불러오기
  const getSearchedUsers = async (keyword, authToken, page) => {
    if (page === 1 && maxLoadedUserPage > 1) {
      return;
    }
    if (page !== 1 && page <= maxLoadedUserPage) {
      return;
    }

    try {
      const response = await axios.get(`${BASE_URL}/user/search/?keyword=${keyword}&page=${page}`, {
        headers: {
          Authorization: `Token ${authToken}`,
        },
      });

      if (response.status === 200) {
        if (response.data.message === "No more pages") {
          setShowUserNextButton(false);
          setMaxLoadedUserPage(page);
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

  // [UserRecommend] 다음 페이지 검색 요청
  useEffect(() => {
    if (searchKeyword) {
      getSearchedUsers(searchKeyword, user.authToken, userPage);
    }
  }, [searchKeyword, user.authToken, userPage]);

  // [UserRecommend] 검색 키워드 변경 시 페이지 초기화
  useEffect(() => {
    setUserPage(1);
    setShowUserNextButton(true);
    dispatch(setSearchedUsers([]));
    setMaxLoadedUserPage(1);
  }, [searchKeyword, dispatch]);

  // [UserRecommend] 스크롤 동작
  const handleScroll = () => {
    if (userScrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = userScrollContainerRef.current;

      setShowUserPrevButton(scrollLeft > 0);
      setShowUserNextButton(scrollLeft <= scrollWidth - clientWidth);
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
      userScrollContainerRef.current.scrollLeft -= 1080;
    }

    setTimeout(() => {
      setIsUserScrolling(false);
    }, 500);
  };

  // [UserRecommend] 다음 페이지로 이동
  const handleNextClick = async () => {
    console.log('isUserScrolling? : ', isUserScrolling);
    if (isUserScrolling) return;
    setIsUserScrolling(true);

    await getSearchedUsers(searchKeyword, user.authToken, userPage + 1);

    setUserPage((prev) => prev + 1);
    if (userScrollContainerRef.current) {
      userScrollContainerRef.current.scrollLeft += 1080;
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
  const [showMandaSimplePrevButton, setShowMandaSimplePrevButton] = useState(false);
  const [showMandaSimpleNextButton, setShowMandaSimpleNextButton] = useState(true);

  // [MandaSimples] 검색 결과 불러오기
  const getSearchedMandaSimples = async (keyword, authToken, page) => {
    if (page === 1 && maxLoadedMandaSimplePage > 1) {
      return;
    }
    if (page !== 1 && page <= maxLoadedMandaSimplePage) {
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

      if (response.status === 200) {
        if (response.data.message === "No more pages") {
          setShowMandaSimpleNextButton(false);
          setMaxLoadedMandaSimplePage(page);
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

  // [MandaSimples] 다음 페이지 검색 요청
  useEffect(() => {
    if (searchKeyword) {
      getSearchedMandaSimples(searchKeyword, user.authToken, mandaSimplePage);
    }
  }, [searchKeyword, user.authToken, mandaSimplePage]);

  // [MandaSimple] 검색 키워드 변경 시 페이지 초기화
  useEffect(() => {
    setMandaSimplePage(1);
    setShowMandaSimpleNextButton(true);
    dispatch(setSearchedMandaSimples([]));
    setMaxLoadedMandaSimplePage(1);
  }, [searchKeyword, dispatch]);

  // [MandaSimple] 스크롤 동작
  const handleMandaSimpleScroll = () => {
    if (mandaSimpleScrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = mandaSimpleScrollContainerRef.current;

      setShowMandaSimplePrevButton(scrollLeft > 0);
      setShowMandaSimpleNextButton(scrollLeft <= scrollWidth - clientWidth);
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
      mandaSimpleScrollContainerRef.current.scrollLeft -= 1080;
    }

    setTimeout(() => {
      setIsMandaSimpleScrolling(false);
    }, 500);
  };

  // [MandaSimple] 다음 페이지로 이동
  const handleMandaSimpleNextClick = async () => {
    console.log('isMandaSimpleScrolling? : ', isMandaSimpleScrolling);
    if (isMandaSimpleScrolling) return;
    setIsMandaSimpleScrolling(true);

    await getSearchedMandaSimples(searchKeyword, user.authToken, mandaSimplePage + 1);

    setMandaSimplePage((prev) => prev + 1);
    if (mandaSimpleScrollContainerRef.current) {
      mandaSimpleScrollContainerRef.current.scrollLeft += 1080;
    }

    setTimeout(() => {
      setIsMandaSimpleScrolling(false);
    }, 500);
  };

  // [Feed] 피드 검색 결과 상태
  const searchedFeeds = search.feeds; // 피드 검색 결과

  return (
    <ThemeProvider theme={theme}>
      <PageLayout>
        <Header></Header>
        <Contents>
          <MandaSimplesWrapper>
            {showMandaSimplePrevButton && (
              <PrevButton
                onClick={handleMandaSimplePrevClick}
                src={process.env.PUBLIC_URL + "/icon/arrow-left.svg"}
              />
            )}
            <MandaSimples ref={mandaSimpleScrollContainerRef}>
              {mandaSimples.map((mandaSimple) => (
                <MandaSimpleSearched key={mandaSimple.id} mandaSimple={mandaSimple} />
              ))}
            </MandaSimples>
            {showMandaSimpleNextButton && (
              <NextButton
                onClick={handleMandaSimpleNextClick}
                src={process.env.PUBLIC_URL + "/icon/arrow-right.svg"}
              />
            )}
          </MandaSimplesWrapper>

          <HorizontalBorder />

          <RecommendsWrapper>
            {showUserPrevButton && (
              <PrevButton
                onClick={handlePrevClick}
                src={process.env.PUBLIC_URL + "/icon/arrow-left.svg"}
              />
            )}
            <Recommends ref={userScrollContainerRef}>
              {targetUsers.map((targetUser) => (
                <UserRecommend key={targetUser.id} targetUser={targetUser} />
              ))}
            </Recommends>
            {showUserNextButton && (
              <NextButton
                onClick={handleNextClick}
                src={process.env.PUBLIC_URL + "/icon/arrow-right.svg"}
              />
            )}
          </RecommendsWrapper>

          <HorizontalBorder />
          {/* <Feeds>
              {feeds.map((feed) => (
                <Feed
                  key={feed.contentInfo.id}
                  userInfo={feed.userInfo}
                  contentInfo={feed.contentInfo}
                />
              ))}
            </Feeds> */}
          {/* <VerticalBorder /> */}
        </Contents>
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
  background-color: ${({ theme }) => theme.color.bg2};
`;

let Contents = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 1080px;
  margin: 40px auto 0px auto;
`;

const MandaSimplesWrapper = styled.div`
  position: relative;
  width: 1080px;
`

const MandaSimples = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex-wrap: wrap;
  box-sizing: border-box;
  width: fit-content;
  max-height: 800px; // 2 rows
  margin-top: 48px;
  margin-bottom: 40px;

  position: relative;

  overflow-x: scroll;
  scroll-behavior: smooth;
  &::-webkit-scrollbar {
    height: 0px;
  }
`;

const ScrollButton = styled.img`
  position: absolute;
  top: 43%;
  border-radius: 50%;
  border: 1px solid ${({ theme }) => theme.color.border};
  background-color: ${({ theme }) => theme.color.bg};
  padding: 4px;

  &:hover {
    border: 1px solid ${({ theme }) => theme.color.secondary};
  }
`;

const PrevButton = styled(ScrollButton)`
  left: calc(-48px - 16px);
`;

const NextButton = styled(ScrollButton)`
  right: -48px;
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

let Feeds = styled.div`
  width: 100%;
  margin: 32px 0px 0px -40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 80px;
`;

let RecommendsWrapper = styled.div`
  position: relative;
  width: 1080px;
`;

let Recommends = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex-wrap: wrap;
  box-sizing: border-box;
  width: fit-content;
  max-height: 244px; // 2 rows
  margin-top: 48px;
  margin-bottom: 40px;

  position: relative;

  overflow-x: scroll;
  scroll-behavior: smooth;
  &::-webkit-scrollbar {
    height: 0px;
  }
`;

export default SearchPage;
