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
import { setSearchedUsers } from "../store/searchSlice";

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

  // 상태 관리
  const user = useSelector((state) => state.user);
  const search = useSelector((state) => state.search); // 검색 결과
  const searchKeyword = search.keyword; // 검색 키워드
  const targetUsers = search.users; // 유저 검색 또는 추천 결과
  const searchedMandaSimples = search.manda_simples; // 만다라트 검색 결과
  const searchedFeeds = search.feeds; // 피드 검색 결과
  const [userPage, setUserPage] = useState(1); // 서버에 요청할 페이지 번호
  const [maxLoadedPage, setMaxLoadedPage] = useState(1); // 현재 로드된 최대 페이지 번호를 추적
  const [isScrolling, setIsScrolling] = useState(false); // 스크롤 중 상태

  // 유저 검색
  const getSearchedUsers = async (keyword, authToken, page) => {
    if (page == 1 && maxLoadedPage > 1) {
      return;
    }

    if (page != 1 && page <= maxLoadedPage) {
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
          setShowNextButton(false);
          setMaxLoadedPage(page);
          return;
        }

        if (page === 1) {
          dispatch(setSearchedUsers(response.data));
        } else if (page !== 1) {
          dispatch(setSearchedUsers([...targetUsers, ...response.data]));
        }
      }

      // 최대 로드된 페이지 업데이트
      if (page > maxLoadedPage) {
        setMaxLoadedPage(page);
      }
    } catch (error) {
      console.log("유저 검색 중 오류 발생: ", error);
    }
  };

  // 다음 페이지 검색 요청
  useEffect(() => {
    if (searchKeyword) {
      getSearchedUsers(searchKeyword, user.authToken, userPage);
    }
  }, [searchKeyword, user.authToken, userPage]);

  // 검색 키워드 변경 시 페이지 초기화
  useEffect(() => {
    setUserPage(1);
    setShowNextButton(true);
    dispatch(setSearchedUsers([]));
    setMaxLoadedPage(1);
  }, [searchKeyword, dispatch]);

  // 스크롤 동작
  const scrollContainerRef = useRef(null);
  const [showPrevButton, setShowPrevButton] = useState(false);
  const [showNextButton, setShowNextButton] = useState(true);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;

      setShowPrevButton(scrollLeft > 0);
      setShowNextButton(scrollLeft <= scrollWidth - clientWidth);
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => {
        container.removeEventListener("scroll", handleScroll);
      };
    }
  }, []);

  // 이전 페이지로 이동
  const handlePrevClick = () => {
    if (isScrolling) return; // 스크롤 중이면 아무것도 하지 않음
    setIsScrolling(true); // 스크롤 시작

    setUserPage((prev) => (prev > 1 ? prev - 1 : prev));
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft -= 1080;
    }

    setTimeout(() => {
      setIsScrolling(false);
    }, 500);
  };

  // 다음 페이지로 이동
  const handleNextClick = async () => {
    if (isScrolling) return;
    setIsScrolling(true);

    await getSearchedUsers(searchKeyword, user.authToken, userPage + 1);

    setUserPage((prev) => prev + 1);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft += 1080;
    }

    setTimeout(() => {
      setIsScrolling(false);
    }, 500);
  };

  // OtherManda(MandaSimples)

  return (
    <ThemeProvider theme={theme}>
      <PageLayout>
        <Header></Header>
        <Contents>
          {/* <OtherManda ref={scrollContainerRef}>
            {mandaSimples.map((mandaSimple) => (
              <MandaSimpleSearched key={mandaSimple.id} searchResult={mandaSimple} />
            ))}
          </OtherManda> */}
          <HorizontalBorder />

          <Recommends ref={scrollContainerRef}>
            {showPrevButton && (
              <PrevButton
                onClick={handlePrevClick}
                src={process.env.PUBLIC_URL + "/icon/arrow-left.svg"}
              />
            )}
            {targetUsers.map((targetUser) => (
              <UserRecommend key={targetUser.id} targetUser={targetUser} />
            ))}
            {showNextButton && (
              <NextButton
                onClick={handleNextClick}
                src={process.env.PUBLIC_URL + "/icon/arrow-right.svg"}
              />
            )}
          </Recommends>

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
  justify-content: center;
  align-items: flex-start;
  width: 1080px;
  margin: 40px auto 0px auto;
  position: relative;
`;

const OtherManda = styled.div`
  display: flex;
  gap: 40px;
  width: calc(100% + 32px);
  overflow-x: scroll;
  white-space: nowrap;
  scroll-behavior: smooth;

  &::-webkit-scrollbar {
    height: 0px;
  }
`;

const ScrollButton = styled.img`
  position: absolute;
  top: 47%;
  border-radius: 50%;
  border: 1px solid ${({ theme }) => theme.color.border};
  background-color: ${({ theme }) => theme.color.bg2};
  padding: 4px;

  &:hover {
    background-color: ${({ theme }) => theme.color.bg3};
  }
`;

const PrevButton = styled(ScrollButton)`
  left: -64px;
`;

const NextButton = styled(ScrollButton)`
  right: -64px;
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

let Recommends = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex-wrap: wrap;
  box-sizing: border-box;
  width: fit-content;
  max-height: 400px;
  margin-top: 48px;
  margin-bottom: 40px;
  overflow-x: scroll;
  white-space: nowrap;
  scroll-behavior: smooth;

  &::-webkit-scrollbar {
    height: 0px;
  }
`;

export default SearchPage;
