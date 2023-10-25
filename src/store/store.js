import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./themeSlice";
import authpageReducer from "./authpageSlice";

const store = configureStore({
  reducer: {
    theme: themeReducer,
    authpage: authpageReducer,
  },
});

export default store;
