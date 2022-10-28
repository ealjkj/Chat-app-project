export default function chat(state = [], action) {
  switch (action.type) {
    case "ADD_MESSAGE":
      return [...state, action.payload.message];
    default:
      return state;
  }
}
