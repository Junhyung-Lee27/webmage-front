// animations.js
import { css } from "styled-components";

export const loadingAnimation = css`
  @keyframes loadingAnimation {
    0% {
      background-position: 0% 0%;
    }
    50% {
      background-position: 100% 100%;
    }
    100% {
      background-position: 0% 0%;
    }
  }
`;

export const loadingBackground = css`
  animation: ${(props) => (props.isLoading ? "loadingAnimation 1.5s ease infinite" : "none")};
  ${(props) => props.isLoading && loadingAnimation};
  background: ${(props) =>
    props.isLoading
      ? "linear-gradient(120deg, #EDEDED 30%, #FDFDFD 38%, #FDFDFD 42%, #EDEDED 50%)"
      : "transparent"};
  background-size: 300% 300%;
`;
