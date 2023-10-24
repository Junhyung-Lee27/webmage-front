import styled from "styled-components";
import { useSelector } from "react-redux";
import Header from "../components/Header";
import UserRecommend from "../components/UserRecommend";

function SearchPage() {
  const currentTheme = useSelector((state) => state.theme.themes[state.theme.currentTheme]);

  return (
    <PageLayout backgroundColor={currentTheme.bg2}>
      <Header></Header>
      <div>검색 및 탐색 결과 페이지입니다.</div>
      <UserRecommend />
    </PageLayout>
  );
}

let PageLayout = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  gap: 40px;
  background-color: ${({ backgroundColor }) => backgroundColor};
`;

export default SearchPage;
