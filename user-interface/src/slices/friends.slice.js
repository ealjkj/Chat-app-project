import { createSlice } from "@reduxjs/toolkit";
import { resetState } from "../actions";

const initialState = [];

const friendsSlice = createSlice({
  name: "friends",
  initialState,
  extraReducers: (builder) => builder.addCase(resetState, () => initialState),
  reducers: {
    changeFriends(state, action) {
      return action.payload.friends;
    },
    addFriends(state, action) {
      return [...state, ...action.payload.friends];
    },
    addFriend(state, action) {
      return [...state, action.payload.friend];
    },
    removeFriend(state, action) {
      return state.filter((friend) => friend._id !== action.payload.friendId);
    },
  },
});

export const { changeFriends, addFriends, addFriend, removeFriend } =
  friendsSlice.actions;
export default friendsSlice.reducer;
