import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    username: "",
  },
  reducers: {
    setUser: (state, action) => {
      state.username = action.payload;
    },
    userStateInit: (state) => {
      state.username = "";
    },
  },
});

export const { setUser, userStateInit } = userSlice.actions;
export default userSlice.reducer;