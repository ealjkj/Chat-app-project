export default function currentConversation(state = null, action) {
  switch (action.type) {
    case "CHANGE_MESSAGES":
      return action.payload.conversationId;
    case "CHANGE_CURRENT_CONVERSATION":
      return action.payload.conversationId;
    default:
      return state;
  }
}
