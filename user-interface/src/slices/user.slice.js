import { createSlice } from "@reduxjs/toolkit";

const initialState = null;

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    changeUser(state, action) {
      return action.payload.user;
    },

    editUser(state, action) {
      return { ...state, ...action.payload.user };
    },

    addFriend(state, action) {
      const filteredRequests = state.friendRequests.filter(
        (user) => user._id !== action.payload.friend._id
      );
      return { ...state, friendRequests: filteredRequests };
    },

    removeFriendRequest(state, action) {
      const newFriendRequests = state.friendRequests.filter(
        (user) => user._id !== action.payload.friend._id
      );
      return { ...state, friendRequests: newFriendRequests };
    },
  },
});

export const { changeUser, editUser, addFriend, removeFriendRequest } =
  userSlice.actions;
export default userSlice.reducer;
