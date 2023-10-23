import styled from "styled-components";
import { useSelector } from "react-redux";

function Header() {
  const currentTheme = useSelector((state) => state.theme.themes[state.theme.currentTheme]);

  return (
    <HeaderLayout backgroundColor={currentTheme.bg}>
      <div>
        <div>로고</div>
        <div>
          <div>만다라트</div>
          <div>피드</div>
          <div>탐색</div>
          <div>채팅</div>
        </div>
      </div>
      <div>
        <div>검색창</div>
        <div>알림 아이콘</div>
        <div>옵션 아이콘</div>
        <div>테마 변경</div>
      </div>
    </HeaderLayout>
  );
}

let HeaderLayout = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: ${({ backgroundColor}) => backgroundColor};
  height: 56px;
  padding: 0px 198px;
`;

export default Header;