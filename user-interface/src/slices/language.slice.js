import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    changeLanguage(state, action) {
      return action.payload.language;
    },
  },
});

export const { changeLanguage } = languageSlice.actions;
export default languageSlice.reducer;
