import styled, { ThemeProvider } from "styled-components";
import { useSelector } from "react-redux";
import componentTheme from "../components/theme";
import { useState } from "react";

function FollowButton() {
  const colorTheme = useSelector((state) => state.theme.themes[state.theme.currentTheme]);
  const filterTheme = useSelector((state) => state.theme.filters[state.theme.currentTheme]);
  const theme = {
    color: colorTheme,
    filter: filterTheme,
    component: componentTheme,
  };

  const [isFollowing, setIsFollowing] = useState(false);

  return (
    <ThemeProvider theme={theme}>
      {isFollowing ? ( 
        <Following color={theme.color.primary} colorhover={theme.color.secondary}>
          팔로잉
        </Following>
      ) : (
        <Follow
          // bgcolor={theme.color.bg3}
          color={theme.color.font2}
          colorhover={theme.color.primary}
        >
          + 팔로우
        </Follow>
      )}
    </ThemeProvider>
  );
}

let Follow = styled.button`
  border: none;
  background: none;
  color: ${({ theme }) => theme.color.primary};
  border-radius: 0.25rem;
  font-size: 13px;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  flex-shrink: 0;

  &:hover {
    background-color: ${({ theme }) => theme.color.bg3};
    transition: 0.3s;
  }
`;
let Following = styled.button`
  border: 2px solid ${({ color }) => color};
  background-color: ${({ color }) => color};
  color: #fff;
  border-radius: 1rem;
  width: 6rem;
  height: 2rem;
  font-size: 1rem;
  font-weight: 600;
  padding: 0.25rem 1rem;
  flex-shrink: 0;
  &:hover {
    border: 1px solid ${({ colorhover }) => colorhover};
    background-color: ${({ colorhover }) => colorhover};
    transition: 0.5s;
  }
`;

export default FollowButton;
