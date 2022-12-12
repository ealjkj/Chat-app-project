export default function alert(state = { message: null }, action) {
  switch (action.type) {
    case "CHANGE_ALERT":
      return { ...state, ...action.payload };
    default:
      return state;
  }
}
