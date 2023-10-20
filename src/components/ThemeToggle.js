import { useDispatch } from "react-redux";
import { changeTheme } from "../store/themeSlice.js";
import styled from "styled-components";

function ThemeToggle() {
  let dispatch = useDispatch();

  return (
    <StyledBtn
      onClick={() => {
        dispatch(changeTheme());
      }}
    >테마 변경</StyledBtn>
  );
}

let StyledBtn = styled.button`
    width: 100px;
    height: 32px;
`

export default ThemeToggle;
