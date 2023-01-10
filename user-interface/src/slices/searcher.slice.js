import { createSlice } from "@reduxjs/toolkit";

const initialState = "";

const searcherSlice = createSlice({
  name: "searcher",
  initialState,
  reducers: {
    changeSearch(state, action) {
      return action.payload.value;
    },
  },
});

export const { changeSearch } = searcherSlice.actions;
export default searcherSlice.reducer;
