import { createSlice } from "@reduxjs/toolkit";
import { resetState } from "../actions";

const initialState = null;

const friendRequestAcceptedSlice = createSlice({
  name: "friendRequestAccepted",
  initialState,
  extraReducers: (builder) => builder.addCase(resetState, () => initialState),
  reducers: {
    changeFriendRequestAccepted(state, action) {
      return action.payload.targetUser;
    },
  },
});

export const { changeFriendRequestAccepted } =
  friendRequestAcceptedSlice.actions;
export default friendRequestAcceptedSlice.reducer;
