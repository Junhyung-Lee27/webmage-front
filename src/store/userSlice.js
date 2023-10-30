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