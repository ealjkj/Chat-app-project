export default function user(state = null, action) {
  switch (action.type) {
    case "CHANGE_USER":
      return action.payload.user;
    case "EDIT_USER":
      return { ...state, ...action.payload.user };
    case "ADD_FRIEND":
      const filteredRequests = state.friendRequests.filter(
        (user) => user._id !== action.payload.friend._id
      );
      return { ...state, friendRequests: filteredRequests };
    case "REMOVE_FRIEND_REQUEST":
      const newFriendRequests = state.friendRequests.filter(
        (user) => user._id !== action.payload.friend._id
      );
      return { ...state, friendRequests: newFriendRequests };
    default:
      return state;
  }
}
