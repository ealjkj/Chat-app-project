import { createSlice } from "@reduxjs/toolkit";
import { resetState } from "../actions";

const initialState = true;

const loadingSlice = createSlice({
  name: "loading",
  initialState,
  // extraReducers: (builder) => builder.addCase(resetState, () => initialState),
  reducers: {
    changeLoading(state, action) {
      return action.payload.value;
    },
  },
});

export const { changeLoading } = loadingSlice.actions;
export default loadingSlice.reducer;
