export default function friendRequestReceived(state = null, action) {
  switch (action.type) {
    case "CHANGE_FRIEND_REQUEST_RECEIVED":
      console.log(action.payload);
      return action.payload.sourceUser;
    default:
      return state;
  }
}
