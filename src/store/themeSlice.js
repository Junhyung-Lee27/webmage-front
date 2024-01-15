// src/store/themeSlice.js

import { createSlice } from "@reduxjs/toolkit";

const themes = {
  light: {
    bg: "#FFFFFF", // 가장 밝은 배경
    bg2: "#FDFDFD", // 덜 밝은 배경
    bg3: "#EDEDED", // 더 덜 밝은 배경
    primary: "#7D79F2", // 브랜드 컬러
    secondary: "#799BF2", // 브랜드 서브 컬러
    font1: "#242424", // 중요한 텍스트
    font2: "#6D6D6D", // 덜 중요한 텍스트
    border: "#D8D6E2", // 경계선 컬러
  },
  dark: {
    bg: "#121212", // 가장 어두운 컬러
    bg2: "#272727", // 덜 어두운 컬러
    bg3: "#424242", // 더 덜 어두운 컬러
    primary: "#7D79F2", // 브랜드 컬러
    secondary: "#799BF2", // 브랜드 서브 컬러
    font1: "#DEDEDE", // 중요한 텍스트
    font2: "#999999", // 덜 중요한 텍스트
    border: "#373737", // 경계선 컬러
  },
};

const filters = {
  light: {
    bg: "invert(100%) sepia(4%) saturate(5384%) hue-rotate(220deg) brightness(111%) contrast(97%)", // 가장 밝은 배경
    bg2: "invert(100%) sepia(0%) saturate(1941%) hue-rotate(310deg) brightness(114%) contrast(98%)", // 덜 밝은 배경
    bg3: "invert(98%) sepia(71%) saturate(211%) hue-rotate(175deg) brightness(110%) contrast(86%)", // 더 덜 밝은 배경
    primary:
      "invert(45%) sepia(79%) saturate(761%) hue-rotate(210deg) brightness(98%) contrast(94%)", // 브랜드 컬러
    secondary:
      "invert(74%) sepia(47%) saturate(6150%) hue-rotate(200deg) brightness(105%) contrast(90%)", // 브랜드 서브 컬러
    font1: "invert(10%) sepia(4%) saturate(7%) hue-rotate(20deg) brightness(96%) contrast(89%)", // 중요한 텍스트
    font2: "invert(45%) sepia(0%) saturate(1%) hue-rotate(303deg) brightness(91%) contrast(84%)", // 덜 중요한 텍스트
    border:
      "invert(98%) sepia(1%) saturate(6149%) hue-rotate(186deg) brightness(88%) contrast(100%)", // 경계선 컬러
  },
  dark: {
    bg: "invert(7%) sepia(91%) saturate(19%) hue-rotate(318deg) brightness(95%) contrast(102%)", // 가장 어두운 컬러
    bg2: "invert(10%) sepia(0%) saturate(4891%) hue-rotate(109deg) brightness(98%) contrast(92%)", // 덜 어두운 컬러
    bg3: "invert(23%) sepia(4%) saturate(20%) hue-rotate(350deg) brightness(95%) contrast(88%)", // 더 덜 어두운 컬러
    primary:
      "invert(45%) sepia(79%) saturate(761%) hue-rotate(210deg) brightness(98%) contrast(94%)", // 브랜드 컬러
    secondary:
      "invert(74%) sepia(47%) saturate(6150%) hue-rotate(200deg) brightness(105%) contrast(90%)", // 브랜드 서브 컬러
    font1: "invert(95%) sepia(3%) saturate(1%) hue-rotate(10deg) brightness(110%) contrast(74%)", // 중요한 텍스트
    font2: " invert(63%) sepia(1%) saturate(0%) hue-rotate(209deg) brightness(97%) contrast(86%)", // 덜 중요한 텍스트
    border: "invert(17%) sepia(0%) saturate(1%) hue-rotate(35deg) brightness(103%) contrast(89%)", // 경계선 컬러
  },
};

const initialState = {
  currentTheme: "light",
  themes,
  filters,
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
