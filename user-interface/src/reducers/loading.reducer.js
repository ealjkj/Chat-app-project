export default function loading(state = true, action) {
  switch (action.type) {
    case "CHANGE_LOADING":
      return action.payload.value;
    default:
      return state;
  }
}
