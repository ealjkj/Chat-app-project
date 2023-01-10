import { createSlice } from "@reduxjs/toolkit";

const initialState = true;

const loggedSlice = createSlice({
  name: "logged",
  initialState,
  reducers: {
    login() {
      return true;
    },
    logout() {
      return false;
    },
  },
});

export const { login, logout } = loggedSlice.actions;
export default loggedSlice.reducer;
