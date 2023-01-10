import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const conversationsSlice = createSlice({
  name: "conversations",
  initialState,
  reducers: {
    changeConversation(state, action) {
      return action.payload.conversations;
    },

    addConversations(state, action) {
      return [action.payload.conversation, ...state];
    },

    removeParticipant(state, action) {
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
    },

    removeConversation(state, action) {
      return state.filter(
        (conversation) => conversation._id !== action.payload.conversationId
      );
    },
  },
});

export const {
  changeConversation,
  addConversations,
  removeParticipant,
  removeConversation,
} = conversationsSlice.actions;
export default conversationsSlice.reducer;
