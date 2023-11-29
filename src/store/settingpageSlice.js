import { createSlice } from "@reduxjs/toolkit";

const settingpageSlice = createSlice({
  name: "settingpage",
  initialState: {
    activeItem: "ProfileView",
  },
  reducers: {
    showProfileView: (state) => {
      state.activeItem = "ProfileView";
    },
    showAccountView: (state) => {
      state.activeItem = "AccountView";
    },
    showBlockedAndReported: (state) => {
      state.activeItem = "BlockedAndReported";
    },
    showDeleteAccount: (state) => {
      state.activeItem = "DeleteAccount";
    },
  },
});

export const { showProfileView, showAccountView, showBlockedAndReported, showDeleteAccount } = settingpageSlice.actions;
export default settingpageSlice.reducer;
