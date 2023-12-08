import { createSlice } from "@reduxjs/toolkit";

const selectedUserSlice = createSlice({
  name: "selectedUser",
  initialState: {},
  reducers: {
    setSelectedUser(state, action) {
      return action.payload;
    }
  }
})

export const {setSelectedUser} = selectedUserSlice.actions;
export default selectedUserSlice.reducer;