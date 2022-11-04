export default function friends(state = [], action) {
  switch (action.type) {
    case "CHANGE_FRIENDS":
      return action.payload.friends;
    case "ADD_FRIENDS":
      return [...state, ...action.payload.friends];
    default:
      return state;
  }
}
