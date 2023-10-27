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
    logout: (state) => {
      state.username = "";
    },
  },
});

export const {setUser, logout} = userSlice.actions;
export default userSlice.reducer;