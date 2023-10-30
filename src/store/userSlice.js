import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    username: "",
    position: "",
    hash: "",
    email: "",
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
    userLogout: (state) => {
      state.username = "";
    },
  },
});

export const { setUser, setUserEmail, userLogout } = userSlice.actions;
export default userSlice.reducer;