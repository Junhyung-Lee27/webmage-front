import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { changeTheme } from "../store/themeSlice.js";

function ThemeSwitch() {
  let dispatch = useDispatch();
  const currentTheme = useSelector((state) => state.theme.currentTheme);

  return (
    <SwitchContainer
      onClick={() => {
        dispatch(changeTheme());
      }}
      theme={currentTheme}
      src={
        currentTheme === "light"
          ? process.env.PUBLIC_URL + "/icon/header/Light.svg"
          : process.env.PUBLIC_URL + "/icon/header/Dark.svg"
      }
      alt="Theme switcher icon"
    ></SwitchContainer>
  );
}

let SwitchContainer = styled.img`
  /* width: 88px; */
  height: 32px;
  border-radius: 18px;
`;

export default ThemeSwitch;
