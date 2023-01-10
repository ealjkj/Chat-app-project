export default function notification(state = null, action) {
  switch (action.type) {
    case "CHANGE_NOTIFICATION":
      return action.payload.notification;
    default:
      return state;
  }
}
