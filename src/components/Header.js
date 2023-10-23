import styled from "styled-components";
import { useSelector } from "react-redux";
import { NavLink } from 'react-router-dom';
import ThemeSwitch from "../components/ThemeSwitch";
import MandaIconUrl from "./../assets/images/Manda_icon.svg";

function Header() {
  const currentTheme = useSelector((state) => state.theme.themes[state.theme.currentTheme]);

  return (
    <Row backgroundColor={currentTheme.bg} justifyContent="space-between" padding="0px 196px">
      <Row gap="48px">
        <MandaIcon />
        <Row gap="16px">
          <StyledLink theme={currentTheme} to="/manda" activeClassName="active">만다라트</StyledLink>
          <StyledLink theme={currentTheme} to="/feed" activeClassName="active">피드</StyledLink>
          <StyledLink theme={currentTheme} to="/explore" activeClassName="active">탐색</StyledLink>
          <StyledLink theme={currentTheme} to="/chat" activeClassName="active">채팅</StyledLink>
        </Row>
      </Row>
      <Row>
        <SearchBox
          type="text"
          placeholder="검색"
          id="search-box"
          fontColor={currentTheme.font1}
          placeholderColor={currentTheme.font2}
          backgroundColor={currentTheme.bg3}
          borderColor={currentTheme.font1}
          margin="4px 0px 0px 0px"
          />
        <div>알림 아이콘</div>
        <div>옵션 아이콘</div>
        <ThemeSwitch />
      </Row>
    </Row>
  );
}

let Row = styled.div`
  height: 56px;
  padding: ${({ padding }) => padding};
  gap: ${({ gap = "16px" }) => gap};
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: ${({ justifyContent = "center" }) => justifyContent};
  background-color: ${({ backgroundColor }) => backgroundColor};
`;

let MandaIcon = styled.div`
  background-image: url(${MandaIconUrl});
  height: 48px;
  width: 48px;
  background-size: cover;
`;

let StyledLink = styled(NavLink)`
  font-size: 20px;
  line-height: 24px;
  font-weight: 600;
  text-align: center;
  padding: 16px 0px;
  text-decoration: none;
  color: ${({ theme }) => theme.font2};

  &.active {
    color: ${({ theme }) => theme.primary};
  }

  &:hover {
    color: ${({ theme }) => theme.secondary};
  }
`

let SearchBox = styled.input`
  height: 34px;
  padding: 7px 120px 7px 16px;
  margin: 11px 0px;
  font-size: 16px;
  color: ${({ fontColor }) => fontColor};
  border: none;
  border-radius: 4px;
  background-color: ${({ backgroundColor }) => backgroundColor};
  &::placeholder {
    color: ${({ placeholderColor }) => placeholderColor};
    opacity: 0.5;
  }
  &:focus {
    outline: 2px solid ${({ borderColor }) => borderColor};
  }
`;

export default Header;