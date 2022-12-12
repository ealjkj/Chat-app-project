export default function friends(state = [], action) {
  switch (action.type) {
    case "CHANGE_FRIENDS":
      return action.payload.friends;
    case "ADD_FRIENDS":
      return [...state, ...action.payload.friends];
    case "ADD_FRIEND":
      return [...state, action.payload.friend];
    case "REMOVE_FRIEND":
      return state.filter((friend) => friend._id !== action.payload.friendId);
    default:
      return state;
  }
}
