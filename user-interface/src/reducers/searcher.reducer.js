export default function searcher(state = "", action) {
  switch (action.type) {
    case "CHANGE_SEARCH":
      return action.payload.value;
    default:
      return state;
  }
}
