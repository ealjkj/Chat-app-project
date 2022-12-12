export default function signed(state = false, action) {
  switch (action.type) {
    case "CHANGE_SIGNED":
      return action.payload.value;
    default:
      return state;
  }
}
