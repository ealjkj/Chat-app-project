import { createSlice } from "@reduxjs/toolkit";
import { resetState } from "../actions";

const initialState = null;

const friendRequestReceivedSlice = createSlice({
  name: "friendRequestReceived",
  initialState,
  extraReducers: (builder) => builder.addCase(resetState, () => initialState),
  reducers: {
    changeFriendRequestReceived(state, action) {
      return action.payload.sourceUser;
    },
  },
});

export const { changeFriendRequestReceived } =
  friendRequestReceivedSlice.actions;
export default friendRequestReceivedSlice.reducer;
