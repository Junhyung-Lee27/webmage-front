// src/store/themeSlice.js

import { createSlice } from "@reduxjs/toolkit";

const themes = {
  light: {
    bg: "#FFFFFF", // 가장 밝은 배경
    bg2: "#FAF9FF", // 덜 밝은 배경
    bg3: "#EBE9FA", // 더 덜 밝은 배경
    primary: "#7269FF", // 브랜드 컬러
    secondary: "#251F4B", // 브랜드 서브 컬러
    font1: "#1A1A1A", // 중요한 텍스트
    font2: "#5B5B5B", // 덜 중요한 텍스트
    border: "#D8D6E2", // 경계선 컬러
  },
  dark: {
    bg: "#0F0B21", // 가장 어두운 컬러
    bg2: "#211634", // 덜 어두운 컬러
    bg3: "#32254A", // 더 덜 어두운 컬러
    primary: "#7269FF", // 브랜드 컬러
    secondary: "#B2A8EE", // 브랜드 서브 컬러
    font1: "#EAEAEA", // 중요한 텍스트
    font2: "#B2B2B2", // 덜 중요한 텍스트
    border: "#3C3572", // 경계선 컬러
  },
};

const initialState = {
  currentTheme: "light",
  themes,
};

let themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    changeTheme(state) {
      state.currentTheme = state.currentTheme === "light" ? "dark" : "light";
    },
  },
});

export const { changeTheme } = themeSlice.actions;
export default themeSlice.reducer;
