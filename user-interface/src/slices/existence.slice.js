import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  username: null,
  email: null,
};

const discoveredUsersSlice = createSlice({
  name: "existence",
  initialState,
  reducers: {
    editExistence(state, action) {
      return { ...state, ...action.payload };
    },
  },
});

export const { editExistence } = discoveredUsersSlice.actions;
export default discoveredUsersSlice.reducer;
