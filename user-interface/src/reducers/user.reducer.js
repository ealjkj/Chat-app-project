export default function user(state = null, action) {
  switch (action.type) {
    case "CHANGE_USER":
      return action.payload.user;
    default:
      return state;
  }
}
