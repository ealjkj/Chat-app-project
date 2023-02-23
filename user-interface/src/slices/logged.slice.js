import { createSlice } from "@reduxjs/toolkit";
import { resetState } from "../actions";

const initialState = false;

const loggedSlice = createSlice({
  name: "logged",
  initialState,
  extraReducers: (builder) => builder.addCase(resetState, () => initialState),
  reducers: {
    changeLogged(state, action) {
      return action.payload.logged;
    },
  },
});

export const { changeLogged } = loggedSlice.actions;
export default loggedSlice.reducer;
