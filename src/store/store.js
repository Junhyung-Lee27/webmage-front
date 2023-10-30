import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { combineReducers } from "redux"; // 여러 개의 reducer를 하나의 root reducer로 합쳐줌
import { persistReducer } from "redux-persist"; // storage를 사용하기 위한 라이브러리
import storage from "redux-persist/lib/storage";

// Slices
import themeReducer from "./themeSlice";
import authpageReducer from "./authpageSlice";
import settingpageReducer from "./settingpageSlice";
import userReducer from "./userSlice";

const rootReducer = combineReducers({
  user: userReducer,
  theme: themeReducer,
  authpage: authpageReducer,
  settingpage: settingpageReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user", "theme"], // 영속성 유지 O
  blacklist: [], // 영속성 유지 X
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
