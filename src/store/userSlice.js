import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userId: "",
    username: "",
    userImg: "",
    userPosition: "",
    userInfo: "",
    userHash: "",
    userEmail: "",
    userProvider: "",
    followerCount: 0,
    successCount: 0,
    authToken: "",
    csrfToken: "",
    isLoggedIn: false,
  },
  reducers: {
    // 프로필, 계정 관리
    setUser: (state, action) => {
      if (action.payload.userId != null) {
        state.userId = action.payload.userId;
      }
      if (action.payload.username != null) {
        state.username = action.payload.username;
      }
      if (action.payload.userImg != null) {
        state.userImg = action.payload.userImg;
      }
      if (action.payload.userPosition != null) {
        state.userPosition = action.payload.userPosition;
      }
      if (action.payload.userInfo != null) {
        state.userInfo = action.payload.userInfo;
      }
      if (action.payload.userHash != null) {
        state.userHash = action.payload.userHash;
      }
      if (action.payload.userEmail != null) {
        state.userEmail = action.payload.userEmail;
      }
      if (action.payload.userProvider != null) {
        state.userProvider = action.payload.userProvider;
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
    resetUserState: () => userSlice.initialState,
  },
});

export const { setUser, setAuthToken, setCsrfToken, setIsLoggedIn, resetUserState } = userSlice.actions;
export default userSlice.reducer;