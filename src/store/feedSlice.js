import { createSlice } from "@reduxjs/toolkit";

const feedSlice = createSlice({
  name: "feed",
  initialState: {},
  reducers: {
    setFeeds(state, action) {
      state.feeds = action.payload;
    },
    clearFeeds(state) {
      state.feeds = [];
    },
  },
});

export const { setFeeds, clearFeeds } = feedSlice.actions;
export default feedSlice.reducer;
