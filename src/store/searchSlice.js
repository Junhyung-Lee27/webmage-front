import { createSlice } from "@reduxjs/toolkit";

const searchSlice = createSlice({
  name: "search",
  initialState: { keyword: "", manda_simples: [], feeds: [], users: [] },
  reducers: {
    setSearchedKeyword(state, action) {
      state.keyword = action.payload;
    },
    setSearchedMandaSimples(state, action) {
      state.manda_simples = action.payload;
    },
    setSearchedFeeds(state, action) {
      state.feeds = action.payload;
    },
    setSearchedUsers(state, action) {
      state.users = action.payload;
    },
    clearSearchedResults(state) {
      state.keyword = "";
      state.manda_simples = [];
      state.feeds = [];
      state.users = [];
    },
  },
});

export const {
  setSearchedKeyword,
  setSearchedMandaSimples,
  setSearchedFeeds,
  setSearchedUsers,
  clearSearchedResults,
} = searchSlice.actions;
export default searchSlice.reducer;
