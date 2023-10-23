import styled from "styled-components";
import Header from "../components/Header";

function SettingPage() {
  return (
    <Column>
      <Header></Header>
      <div>환경설정 페이지입니다.</div>
    </Column>
  );
}

let Column = styled.div`
  display: flex;
  flex-direction: column;
`;

export default SettingPage;
