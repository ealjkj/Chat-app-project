export default function messages(state = [], action) {
  switch (action.type) {
    case "CHANGE_MESSAGES":
      return action.payload.messages;
    case "ADD_MESSAGE":
      return [...state, action.payload.message];
    default:
      return state;
  }
}
