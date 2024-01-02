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
        onClick={() => {
          setFeedMode("WRITE");
          handleShow();
        }}
      >
          피드 게시물 작성
      </WriteFeed>
    </ThemeProvider>
  );
}

let WriteFeed = styled.button`
  ${({ theme }) => theme.component.flexBox.rowCenter};

  width: 100%;
  height: 56px;

  color: ${({ theme }) => theme.color.font1};
  font-size: 14px;
  font-weight: 600;
  text-align: center;
  letter-spacing: 1px;

  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: 8px;
  background-color: ${({ theme }) => theme.color.bg};

  cursor: pointer;

  transition: color 0.15s ease, background-color 0.15s ease;
  &:hover {
    color: ${({ theme }) => theme.color.bg};
    background-color: ${({ theme }) => theme.color.primary};
  }
`;