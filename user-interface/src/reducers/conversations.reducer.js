export default function conversations(state = [], action) {
  switch (action.type) {
    case "CHANGE_CONVERSATIONS":
      return action.payload.conversations;
    case "ADD_CONVERSATIONS":
      return [...state, ...action.payload.conversations];
    case "ADD_CONVERSATION":
      return [action.payload.conversation, ...state];
    case "REMOVE_PARTICIPANT":
      const newState = state.map((conversation) => {
        if (conversation._id === action.payload.conversationId)
          return {
            ...conversation,
            members: conversation.members.filter(
              (user) => user._id !== action.payload.participantId
            ),
          };
        return conversation;
      });
      return newState;
    case "REMOVE_CONVERSATION":
      return state.filter(
        (conversation) => conversation._id !== action.payload.conversationId
      );
    default:
      return state;
  }
}
