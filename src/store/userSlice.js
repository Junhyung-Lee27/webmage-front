import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userId: "",
    username: "",
    userImg: "",
    position: "",
    info: "",
    hash: "",
    email: "",
    followerCount: 0,
    successCount: 0,
    authToken: "",
    csrfToken: "",
    isLoggedIn: false,
  },
  reducers: {
    // 프로필, 계정 관리
    setUser: (state, action) => {
      if (action.payload.userId) {
        state.userId = action.payload.userId;
      }
      if (action.payload.username) {
        state.username = action.payload.username;
      }
      if (action.payload.userImg) {
        state.userImg = action.payload.userImg;
      }
      if (action.payload.position) {
        state.position = action.payload.position;
      }
      if (action.payload.info) {
        state.info = action.payload.info;
      }
      if (action.payload.hash) {
        state.hash = action.payload.hash;
      }
      if (action.payload.email) {
        state.email = action.payload.email;
      }
      if (action.payload.followerCount != null) {
        state.followerCount = action.payload.followerCount;
      }
      if (action.payload.successCount != null) {
        state.successCount = action.payload.successCount;
      }
    },
    // 토큰 관리
    setAuthToken: (state, action) => {
      state.authToken = action.payload;
    },
    setCsrfToken: (state, action) => {
      state.csrfToken = action.payload;
    },
    // 로그인
    setIsLoggedIn: (state, action) => {
      state.isLoggedIn = action.payload;
    },
    // 초기화(로그아웃, 탈퇴)
    resetUserState: (state) => {
      Object.assign(state, userSlice.initialState);
    },
  },
});

export const { setUser, setAuthToken, setCsrfToken, setIsLoggedIn, resetUserState } = userSlice.actions;
export default userSlice.reducer;