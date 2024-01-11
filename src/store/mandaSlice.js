import { createSlice } from "@reduxjs/toolkit";

const mandaSlice = createSlice({
  name: "manda",
  initialState: {
    main: [],
    subs: [],
    contents: [],
    privacy: ""
  },
  reducers: {
    // 핵심목표 변경
    setMain: (state, action) => {
      state.main = action.payload;
    },
    setSubs: (state, action) => {
      state.subs = action.payload;
    },
    setContents: (state, action) => {
      state.contents = action.payload;
    },
    setPrivacy: (state, action) => {
      state.privacy = action.payload;
    },
    resetMandaState: (state) => {
      state.main = [];
      state.subs = []; 
      state.contents = [];
    },
    resetMandaSubAndContent: (state) => {
      state.subs = []; 
      state.contents = [];
    },
  },
});

export const { setMain, setSubs, setContents, setPrivacy, resetMandaState, resetMandaSubAndContent } =
  mandaSlice.actions;
export default mandaSlice.reducer;
