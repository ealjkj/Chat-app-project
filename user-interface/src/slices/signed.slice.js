import { createSlice } from "@reduxjs/toolkit";
import { resetState } from "../actions";

const initialState = false;

const signedSlice = createSlice({
  name: "signed",
  extraReducers: (builder) => builder.addCase(resetState, () => initialState),
  initialState,
  reducers: {
    changeSigned(state, action) {
      return action.payload.value;
    },
  },
});

export const { changeSigned } = signedSlice.actions;
export default signedSlice.reducer;
