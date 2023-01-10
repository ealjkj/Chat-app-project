import { createSlice } from "@reduxjs/toolkit";

const initialState = null;

const friendRequestReceivedSlice = createSlice({
  name: "friendRequestReceived",
  initialState,
  reducers: {
    changeFriendRequestReceived(state, action) {
      return action.payload.sourceUser;
    },
  },
});

export const { changeFriendRequestReceived } =
  friendRequestReceivedSlice.actions;
export default friendRequestReceivedSlice.reducer;
