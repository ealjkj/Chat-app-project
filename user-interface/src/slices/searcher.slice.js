import { createSlice } from "@reduxjs/toolkit";
import { resetState } from "../actions";

const initialState = "";

const searcherSlice = createSlice({
  name: "searcher",
  initialState,
  extraReducers: (builder) => builder.addCase(resetState, () => initialState),
  reducers: {
    changeSearch(state, action) {
      return action.payload.value;
    },
  },
});

export const { changeSearch } = searcherSlice.actions;
export default searcherSlice.reducer;
