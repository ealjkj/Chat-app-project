import { createSlice } from "@reduxjs/toolkit";

const initialState = true;

const loadingSlice = createSlice({
  name: "loading",
  initialState,
  reducers: {
    changeLoading(state, action) {
      return action.payload.value;
    },
  },
});

export const { changeLoading } = loadingSlice.actions;
export default loadingSlice.reducer;
