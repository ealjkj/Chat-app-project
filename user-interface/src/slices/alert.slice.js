import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  message: null,
};

const alertSlice = createSlice({
  name: "alert",
  initialState,
  reducers: {
    changeAlert(state, action) {
      return { ...state, ...action.payload };
    },
  },
});

export const { changeAlert } = alertSlice.actions;
export default alertSlice.reducer;
