import { createSlice } from "@reduxjs/toolkit";

const mandaSlice = createSlice({
  name: "manda",
  initialState: {
    main: [],
    subs: [],
    contents: [],
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
  },
});

export const { setMain, setSubs, setContents } = mandaSlice.actions;
export default mandaSlice.reducer;
