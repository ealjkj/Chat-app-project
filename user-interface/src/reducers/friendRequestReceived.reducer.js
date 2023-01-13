export default function friendRequestReceived(state = null, action) {
  switch (action.type) {
    case "CHANGE_FRIEND_REQUEST_RECEIVED":
      return action.payload.sourceUser;
    default:
      return state;
  }
}
