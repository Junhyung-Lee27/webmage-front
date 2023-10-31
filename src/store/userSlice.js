import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    username: "",
    position: "",
    hash: "",
    email: "",
    token: "",
    isLoggedIn: false,
  },
  reducers: {
    // 프로필, 계정 관리
    setUser: (state, action) => {
      if (action.payload.username) {
        state.username = action.payload.username;
      }
      if (action.payload.position) {
        state.position = action.payload.position;
      }
      if (action.payload.hash) {
        state.hash = action.payload.hash;
      }
      if (action.payload.email) {
        state.email = action.payload.email;
      }
    },
    // 토큰 관리
    setToken: (state, action) => {
      state.token = action.payload;
    },
    // 로그인
    setIsLoggedIn: (state, action) => {
      state.isLoggedIn = action.payload;
    },
    // 초기화(로그아웃, 탈퇴)
    resetUserState: (state) => {
      return { ...state, ...userSlice.initialState };
    },
  },
});

export const { setUser, setToken, setIsLoggedIn, resetUserState } = userSlice.actions;
export default userSlice.reducer;