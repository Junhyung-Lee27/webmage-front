import styled, { ThemeProvider } from "styled-components";
import { useSelector } from "react-redux";
import Header from "../components/Header";
import UserRecommend from "../components/UserRecommend";
import componentTheme from "./../components/theme";

function SearchPage() {
  const colorTheme = useSelector((state) => state.theme.themes[state.theme.currentTheme]);
  const filterTheme = useSelector((state) => state.theme.filters[state.theme.currentTheme]);
  const theme = {
    color: colorTheme,
    filter: filterTheme,
    component: componentTheme,
  };

  return (
    <ThemeProvider theme={theme}>
      <PageLayout>
        <Header></Header>
        <Contents>
          <MandaSimple>만다심플</MandaSimple>
          <Row>
            <Feeds>피드 컴포넌트로 교체</Feeds>
            <Recommends>
              <UserRecommend />
              <UserRecommend />
              <UserRecommend />
              <UserRecommend />
            </Recommends>
          </Row>
        </Contents>
      </PageLayout>
    </ThemeProvider>
  );
}

let PageLayout = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: ${({ theme }) => theme.color.bg};
`;

let Contents = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 80px;

  margin: 28px 196px 80px 196px;
`;

let MandaSimple = styled.div`
  width: 100%;
  height: 370px;
  line-height: 370px;
  text-align: center;
  background-color: #a7a7a7;
`;

let Row = styled.div`
  display: flex;
  align-items: flex-start;
  width: 100%;
  gap: 38px;
`;

let Feeds = styled.div`
  display: flex;
  flex-direction: column;
  width: 70%;
  height: 1600px;
  border: 10px solid white;
  background-color: #a7a7a7;
`;

let Recommends = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export default SearchPage;
