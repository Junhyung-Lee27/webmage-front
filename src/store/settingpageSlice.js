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
    showBlockedUsers: (state) => {
      state.activeItem = "BlockedUsers";
    },
    showDeleteAccount: (state) => {
      state.activeItem = "DeleteAccount";
    },
  },
});

export const { showProfileView, showAccountView, showBlockedUsers, showDeleteAccount } = settingpageSlice.actions;
export default settingpageSlice.reducer;
