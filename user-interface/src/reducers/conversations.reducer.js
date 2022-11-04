export default function conversations(state = [], action) {
  switch (action.type) {
    case "CHANGE_CONVERSATIONS":
      return action.payload.conversations;
    case "ADD_CONVERSATIONS":
      return [...state, ...action.payload.conversations];
    default:
      return state;
  }
}
