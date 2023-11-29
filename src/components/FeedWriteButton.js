import { useSelector } from "react-redux";
import componentTheme from "../components/theme";
import { styled, ThemeProvider } from "styled-components";
import { useState } from "react";

export default function FeedWriteButton({ handleShow, setShow, setFeedMode }) {
  // 테마
  const colorTheme = useSelector((state) => state.theme.themes[state.theme.currentTheme]);
  const filterTheme = useSelector((state) => state.theme.filters[state.theme.currentTheme]);
  const theme = {
    color: colorTheme,
    filter: filterTheme,
    component: componentTheme,
  };

  return (
    <ThemeProvider theme={theme}>
      <WriteFeed
        bgcolor={theme.color.primary}
        onClick={() => {
          setFeedMode("WRITE");
          handleShow();
        }}
      >
        <StyledText size="1rem" weight="700" color={theme.color.bg} align="center">
          게시물 작성
        </StyledText>
      </WriteFeed>
    </ThemeProvider>
  );
}

let WriteFeed = styled.button`
  width: 100%;
  height: 42px;
  margin: 42px auto 32px auto;
  font-size: 16px;
  font-weight: 700;
  line-height: 20px;
  color: white;
  border: none;
  border-radius: 8px;
  ${({ theme }) => theme.component.flexBox.rowCenter};
  background-color: ${({ bgcolor }) => bgcolor};
  cursor: pointer;
`;

let StyledText = styled.span`
  font-size: ${({ size }) => size};
  font-weight: ${({ weight }) => weight};
  color: ${({ color }) => color};
  text-align: ${({ align }) => align};
  margin: ${({ margin }) => margin};
`;
