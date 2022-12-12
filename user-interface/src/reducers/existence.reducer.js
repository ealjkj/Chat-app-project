export default function friends(
  state = { username: null, email: null },
  action
) {
  switch (action.type) {
    case "EDIT_EXISTENCE":
      return { ...state, ...action.payload };
    default:
      return state;
  }
}
