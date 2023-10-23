import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { changeTheme } from "../store/themeSlice.js";

function ThemeSwitch() {
  let dispatch = useDispatch();
  const currentTheme = useSelector((state) => state.theme.themes[state.theme.currentTheme]);

  return (
    <SwitchContainer
      backgroundColor={currentTheme.bg2}
      onClick={() => {
        dispatch(changeTheme());
      }}
    >
      <ThemeIcon active={currentTheme === "dark"} />
    </SwitchContainer>
  );
}

let SwitchContainer = styled.button`
  width: 96px;
  height: 36px;
  border-radius: 18px;
  background-color: ${({ backgroundColor }) => backgroundColor};
  position: relative;
`;

const ThemeIcon = styled.div`
  width: 32px; 
  height: 32px;
  border-radius: 20px;
  background-image: url(${props => props.theme === 'light' ? './../assets/images/sun-icon.svg' : './../assets/images/moon-icon.svg'});  background-size: cover;
  background-size: cover;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: ${props => props.active ? 'calc(100% - 40px - 5px)' : '5px'}; // 5px는 여백입니다
  transition: left 0.3s ease-in-out;
`;

export default ThemeSwitch;
