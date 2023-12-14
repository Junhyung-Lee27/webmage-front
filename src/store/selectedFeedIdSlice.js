import { createSlice } from "@reduxjs/toolkit";

const selectedFeedIdSlice = createSlice({
  name: "selectedFeedId",
  initialState: null,
  reducers: {
    setSelectedFeedId(state, action) {
      return action.payload;
    },
  },
});

export const { setSelectedFeedId } = selectedFeedIdSlice.actions;
export default selectedFeedIdSlice.reducer;
