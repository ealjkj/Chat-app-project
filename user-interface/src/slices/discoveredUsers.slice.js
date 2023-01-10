import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const discoveredUsersSlice = createSlice({
  name: "discoveredUsers",
  initialState,
  reducers: {
    changeDiscoveredUsers(state, action) {
      return action.payload.discoveredUsers;
    },
  },
});

export const { changeDiscoveredUsers } = discoveredUsersSlice.actions;
export default discoveredUsersSlice.reducer;
