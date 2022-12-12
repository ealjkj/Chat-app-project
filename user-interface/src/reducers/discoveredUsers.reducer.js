export default function discoveredUsers(state = [], action) {
  switch (action.type) {
    case "CHANGE_DISCOVERED_USERS":
      return action.payload.discoveredUsers;
    default:
      return state;
  }
}
