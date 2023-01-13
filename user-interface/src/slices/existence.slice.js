import { createSlice } from "@reduxjs/toolkit";
import { resetState } from "../actions";

const initialState = {
  username: null,
  email: null,
};

const discoveredUsersSlice = createSlice({
  name: "existence",
  initialState,
  extraReducers: (builder) => builder.addCase(resetState, () => initialState),
  reducers: {
    editExistence(state, action) {
      return { ...state, ...action.payload };
    },
  },
});

export const { editExistence } = discoveredUsersSlice.actions;
export default discoveredUsersSlice.reducer;
