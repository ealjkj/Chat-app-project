import { createSlice } from "@reduxjs/toolkit";
import { resetState } from "../actions";

const initialState = {
  message: null,
};

const alertSlice = createSlice({
  name: "alert",
  initialState,
  extraReducers: (builder) => builder.addCase(resetState, () => initialState),
  reducers: {
    changeAlert(state, action) {
      return { ...state, ...action.payload };
    },
  },
});

export const { changeAlert } = alertSlice.actions;
export default alertSlice.reducer;
