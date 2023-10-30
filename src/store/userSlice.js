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
    // 프로필 관리
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
    },
    // 계정 관리
    setUserEmail: (state, action) => {
      state.email = action.payload;
    },
    // 토큰 관리
    setToken: (state, action) => {
      state.token = action.payload;
    },
    // 로그인
    setIsLoggedIn: (state, action) => {
      state.isLoggedIn = action.payload;
    },
    // 로그아웃
    userLogout: (state) => {
      state.username = "";
      state.position = "";
      state.hash = "";
      state.email = "";
    },
  },
});

export const { setUser, setUserEmail, setToken, setIsLoggedIn, userLogout } = userSlice.actions;
export default userSlice.reducer;