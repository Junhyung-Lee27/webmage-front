import styled from "styled-components";
import { useSelector } from "react-redux";

function Header() {
  const currentTheme = useSelector((state) => state.theme.themes[state.theme.currentTheme]);

  return (
    <div>
      <div>헤더</div>
    </div>
  );
}
