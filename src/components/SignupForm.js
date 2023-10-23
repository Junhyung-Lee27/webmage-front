import styled from "styled-components";
import { useSelector } from "react-redux";

function SignupForm() {
  const currentTheme = useSelector((state) => state.theme.themes[state.theme.currentTheme]);

  return (
    <div>
      <div>회원가입 폼</div>
    </div>
  )
}