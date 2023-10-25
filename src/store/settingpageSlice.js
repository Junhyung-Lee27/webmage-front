import { createSlice } from "@reduxjs/toolkit";

const settingpageSlice = createSlice({
  name: "settingpage",
  initialState: {
    activeItem: "ProfileEdit",
  },
  reducers: {
    showProfileEdit: (state) => {
      state.activeItem = "ProfileEdit";
    },
    showBlockedUsers: (state) => {
      state.activeItem = "BlockedUsers";
    },
    showDeleteAccount: (state) => {
      state.activeItem = "DeleteAccount";
    },
  },
});

export const { showProfileEdit, showBlockedUsers, showDeleteAccount } = settingpageSlice.actions;
export default settingpageSlice.reducer;
