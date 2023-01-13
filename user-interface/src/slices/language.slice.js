import { createSlice } from "@reduxjs/toolkit";
import { resetState } from "../actions";

const initialState = [];

const languageSlice = createSlice({
  name: "language",
  initialState,
  extraReducers: (builder) => builder.addCase(resetState, () => initialState),
  reducers: {
    changeLanguage(state, action) {
      return action.payload.language;
    },
  },
});

export const { changeLanguage } = languageSlice.actions;
export default languageSlice.reducer;
