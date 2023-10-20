// src/store/themeSlice.js

import { configureStore, createSlice } from "@reduxjs/toolkit";

const themes = {
  light: {
    backgroundColor: "#FFFFFF",
    primaryColor: "#7269FF",
    secondaryColor: "#251F4B",
  },
  dark: {
    backgroundColor: "#0F0B21",
    primaryColor: "#FFFFFF",
    secondaryColor: "#7269FF",
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
