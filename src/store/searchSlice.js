import { createSlice } from "@reduxjs/toolkit";

const searchSlice = createSlice({
  name: "search",
  initialState: { manda_simples: [], feeds: [], users: [] },
  reducers: {
    setSearchResults(state, action) {
      state.manda_simples = action.payload.manda_simples;
      state.feeds = action.payload.feeds;
      state.users = action.payload.users;
    },
    clearSearchResults(state) {
      state.manda_simples = [];
      state.feeds = [];
      state.users = [];
    },
  },
});

export const { setSearchResults, clearSearchResults } = searchSlice.actions;
export default searchSlice.reducer;
