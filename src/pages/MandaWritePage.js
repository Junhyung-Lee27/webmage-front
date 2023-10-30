import styled from "styled-components";
import { useSelector } from "react-redux";
import Header from "../components/Header";
import { useState } from "react";
import MandaWrite from "../components/MandaWrite";

function MandaWritePage() {
  const currentTheme = useSelector((state) => state.theme.themes[state.theme.currentTheme]);

  return (
    <PageLayout backgroundcolor={currentTheme.bg2}>
      <Header></Header>
      <MandaWrite />

    </PageLayout>
  )
}

const PageLayout = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  gap: 40px;
  background-color: ${({ backgroundcolor }) => backgroundcolor};
`;




export default MandaWritePage;
