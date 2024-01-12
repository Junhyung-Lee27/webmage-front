// src/store/themeSlice.js

import { createSlice } from "@reduxjs/toolkit";

const themes = {
  light: {
    bg: "#FFFFFF", // 가장 밝은 배경
    bg2: "#FDFDFD", // 덜 밝은 배경
    bg3: "#EDEDED", // 더 덜 밝은 배경
    primary: "#7269FF", // 브랜드 컬러
    secondary: "#5049B3", // 브랜드 서브 컬러 (보색)
    font1: "#242424", // 중요한 텍스트
    font2: "#6D6D6D", // 덜 중요한 텍스트
    border: "#D8D6E2", // 경계선 컬러
  },
  dark: {
    bg: "#121212", // 가장 어두운 컬러
    bg2: "#272727", // 덜 어두운 컬러
    bg3: "#424242", // 더 덜 어두운 컬러
    primary: "#5049B3", // 브랜드 컬러
    secondary: "#3E388A", // 브랜드 서브 컬러
    font1: "#DEDEDE", // 중요한 텍스트
    font2: "#999999", // 덜 중요한 텍스트
    border: "#373737", // 경계선 컬러
  },
};

const filters = {
  light: {
    bg: "invert(86%) sepia(100%) saturate(0%) hue-rotate(42deg) brightness(106%) contrast(103%)", // 가장 밝은 배경
    bg2: "invert(89%) sepia(2%) saturate(1308%) hue-rotate(204deg) brightness(108%) contrast(104%)", // 덜 밝은 배경
    bg3: "invert(94%) sepia(50%) saturate(528%) hue-rotate(181deg) brightness(100%) contrast(97%)", // 더 덜 밝은 배경
    primary: "invert(43%) sepia(15%) saturate(4177%) hue-rotate(215deg) brightness(101%) contrast(101%)", // 브랜드 컬러
    secondary: "invert(15%) sepia(41%) saturate(885%) hue-rotate(208deg) brightness(93%) contrast(102%)", // 브랜드 서브 컬러
    font1: "invert(0%) sepia(20%) saturate(53%) hue-rotate(169deg) brightness(78%) contrast(80%)", // 중요한 텍스트
    font2: "invert(38%) sepia(0%) saturate(351%) hue-rotate(203deg) brightness(90%) contrast(89%)", // 덜 중요한 텍스트
    border: "invert(92%) sepia(8%) saturate(223%) hue-rotate(210deg) brightness(98%) contrast(81%)", // 경계선 컬러
  },
  dark: {
    bg: "invert(5%) sepia(14%) saturate(6827%) hue-rotate(230deg) brightness(96%) contrast(100%)", // 가장 어두운 컬러
    bg2: "invert(9%) sepia(6%) saturate(6713%) hue-rotate(224deg) brightness(95%) contrast(97%)", // 덜 어두운 컬러
    bg3: "invert(13%) sepia(10%) saturate(3956%) hue-rotate(221deg) brightness(93%) contrast(89%)", // 더 덜 어두운 컬러
    primary: "invert(43%) sepia(15%) saturate(4177%) hue-rotate(215deg) brightness(101%) contrast(101%)", // 브랜드 컬러
    secondary: "invert(72%) sepia(8%) saturate(1882%) hue-rotate(207deg) brightness(96%) contrast(94%)", // 브랜드 서브 컬러
    font1: "invert(99%) sepia(2%) saturate(251%) hue-rotate(234deg) brightness(114%) contrast(84%)", // 중요한 텍스트
    font2: "invert(66%) sepia(12%) saturate(0%) hue-rotate(147deg) brightness(109%) contrast(84%)", // 덜 중요한 텍스트
    border: "invert(19%) sepia(75%) saturate(619%) hue-rotate(209deg) brightness(93%) contrast(92%)", // 경계선 컬러
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
