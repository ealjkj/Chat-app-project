import { createSlice } from "@reduxjs/toolkit";
import { resetState } from "../actions";

const initialState = [];

const discoveredUsersSlice = createSlice({
  name: "discoveredUsers",
  initialState,
  extraReducers: (builder) => builder.addCase(resetState, () => initialState),
  reducers: {
    changeDiscoveredUsers(state, action) {
      return action.payload.discoveredUsers;
    },
  },
});

export const { changeDiscoveredUsers } = discoveredUsersSlice.actions;
export default discoveredUsersSlice.reducer;
