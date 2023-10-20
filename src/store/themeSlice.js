// src/store/themeSlice.js

import { createSlice } from "@reduxjs/toolkit";

const themes = {
  light: {
    backgroundColor: "#FFFFFF",
    backgroundColor2: "#EBE9FA",
    primaryColor: "#7269FF",
    secondaryColor: "#251F4B",
    borderColor: "#D8D6E2",
  },
  dark: {
    backgroundColor: "#0F0B21",
    backgroundColor2: "#221C44",
    primaryColor: "#FFFFFF",
    secondaryColor: "#7269FF",
    borderColor: "#3B336C",
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
