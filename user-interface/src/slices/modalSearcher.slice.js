import { createSlice } from "@reduxjs/toolkit";
import { resetState } from "../actions";

const initialState = "";

const modalSearcherSlice = createSlice({
  name: "modalSearcher",
  initialState,
  extraReducers: (builder) => builder.addCase(resetState, () => initialState),
  reducers: {
    changeModalSearch(state, action) {
      return action.payload.value;
    },
  },
});

export const { changeModalSearch } = modalSearcherSlice.actions;
export default modalSearcherSlice.reducer;
