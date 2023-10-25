import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./themeSlice";
import authpageReducer from "./authpageSlice";
import settingpageReducer from "./settingpageSlice"

const store = configureStore({
  reducer: {
    theme: themeReducer,
    authpage: authpageReducer,
    settingpage: settingpageReducer
  },
});

export default store;
