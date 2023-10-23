import styled from "styled-components";
import { useSelector } from "react-redux";

function ForgotPassword() {
  const currentTheme = useSelector((state) => state.theme.themes[state.theme.currentTheme]);

  return (
    <div>
      <div>비밀번호 찾기 폼</div>
    </div>
  );
}
