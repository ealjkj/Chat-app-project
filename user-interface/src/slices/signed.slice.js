import { createSlice } from "@reduxjs/toolkit";

const initialState = false;

const signedSlice = createSlice({
  name: "signed",
  initialState,
  reducers: {
    changeSigned(state, action) {
      return action.payload.value;
    },
  },
});

export const { changeSigned } = signedSlice.actions;
export default signedSlice.reducer;
