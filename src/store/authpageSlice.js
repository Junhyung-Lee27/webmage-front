import { createSlice } from "@reduxjs/toolkit";

const authpageSlice = createSlice({
  name: "authpage",
  initialState: {
    showingForm: "Login",
  },
  reducers: {
    showLogin: (state) => {
      state.showingForm = "Login";
    },
    showSignup: (state) => {
      state.showingForm = "Signup";
    },
    showForgotPassword: (state) => {
        state.showingForm = "ForgotPassword"
    }
  },
});

export const { showSignup, showLogin, showForgotPassword } = authpageSlice.actions;
export default authpageSlice.reducer;
