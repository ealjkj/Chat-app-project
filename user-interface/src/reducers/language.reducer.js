export default function language(state = "en", action) {
  switch (action.type) {
    case "CHANGE_LANGUAGE":
      return action.payload.language;
    default:
      return state;
  }
}
