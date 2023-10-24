import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { changeTheme } from "../store/themeSlice.js";
import DarkUrl from "./../assets/images/Dark.svg";
import LightUrl from "./../assets/images/Light.svg";

function ThemeSwitch() {
  let dispatch = useDispatch();
  const currentTheme = useSelector((state) => state.theme.currentTheme);

  return (
    <SwitchContainer
      onClick={() => {
        dispatch(changeTheme());
      }}
      theme={currentTheme}
    ></SwitchContainer>
  );
}

let SwitchContainer = styled.div`
  width: 88px;
  height: 36px;
  border-radius: 18px;
  background-size: cover;
  background-image: url(${(props) => (props.theme === "light" ? LightUrl : DarkUrl)});
`;

export default ThemeSwitch;
