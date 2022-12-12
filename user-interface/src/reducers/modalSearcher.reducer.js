export default function modalSearcher(state = "", action) {
  switch (action.type) {
    case "CHANGE_MODAL_SEARCH":
      return action.payload.value;
    default:
      return state;
  }
}
