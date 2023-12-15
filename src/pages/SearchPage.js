import styled, { ThemeProvider } from "styled-components";
import { useSelector } from "react-redux";
import Header from "../components/Header";
import UserRecommend from "../components/UserRecommend";
import MandaSimpleSearched from "../components/MandaSimpleSearched";
import Feed from "../components/Feed";
import componentTheme from "./../components/theme";
import { useState, useRef, useEffect } from "react";

function SearchPage() {
  const colorTheme = useSelector((state) => state.theme.themes[state.theme.currentTheme]);
  const filterTheme = useSelector((state) => state.theme.filters[state.theme.currentTheme]);
  const theme = {
    color: colorTheme,
    filter: filterTheme,
    component: componentTheme,
  };

  //// 검색 결과 상태
  const searchResults = useSelector((state) => state.search);
  let mandaSimples = searchResults.manda_simples;
  let feeds = searchResults.feeds;
  let users = searchResults.users;

  // OtherManda 스크롤 버튼
  const scrollContainerRef = useRef(null);

  const [showPrevButton, setShowPrevButton] = useState(false);
  const [showNextButton, setShowNextButton] = useState(true);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;

      setShowPrevButton(scrollLeft > 0);
      setShowNextButton(scrollLeft < scrollWidth - clientWidth);
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

  const handlePrevClick = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft -= 600;
    }
  };

  const handleNextClick = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft += 600;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <PageLayout>
        <Header></Header>
        <Contents>
          {showPrevButton && (
            <PrevButton
              onClick={handlePrevClick}
              src={process.env.PUBLIC_URL + "/icon/arrow-left.svg"}
            />
          )}
          <OtherManda ref={scrollContainerRef}>
            {mandaSimples.map((mandaSimple) => (
              <MandaSimpleSearched key={mandaSimple.id} searchResult={mandaSimple} />
            ))}
          </OtherManda>
          {showNextButton && (
            <NextButton
              onClick={handleNextClick}
              src={process.env.PUBLIC_URL + "/icon/arrow-right.svg"}
            />
          )}
          <HorizontalBorder />
          <Row>
            <Feeds>
              {feeds.map((feed) => (
                <Feed
                  key={feed.contentInfo.id}
                  userInfo={feed.userInfo}
                  contentInfo={feed.contentInfo}
                />
              ))}
            </Feeds>
            <VerticalBorder />
            <Recommends>
              {users.map((user) => (
                <UserRecommend key={user.id} user={user} />
              ))}
            </Recommends>
          </Row>
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
  background-color: ${({ theme }) => theme.color.bg};
`;

let Contents = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
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
  top: 120px;
  border-radius: 50%;
  border: 1px solid ${({ theme }) => theme.color.border};
  background-color: ${({ theme }) => theme.color.bg2};
  padding: 4px;

  &:hover {
    background-color: ${({ theme }) => theme.color.bg3};
  }
`;

const PrevButton = styled(ScrollButton)`
  left: -48px;
`;

const NextButton = styled(ScrollButton)`
  right: -40px;
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
  gap: 16px;
  width: auto;
  margin-top: 48px;
  margin-bottom: 80px;
`;

export default SearchPage;
