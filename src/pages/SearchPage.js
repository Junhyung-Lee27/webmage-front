import styled from "styled-components";
import Header from "../components/Header";

function SearchPage() {
  return (
    <Column>
      <Header></Header>
      <div>검색 및 탐색 결과 페이지입니다.</div>
    </Column>
  );
}

let Column = styled.div`
  display: flex;
  flex-direction: column;
`;

export default SearchPage;
