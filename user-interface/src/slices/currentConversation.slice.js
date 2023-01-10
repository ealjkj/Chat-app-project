import { createSlice } from "@reduxjs/toolkit";

const initialState = null;

const currentConversationSlice = createSlice({
  name: "currentConversation",
  initialState,
  reducers: {
    changeMessages(state, action) {
      return action.payload.conversationId;
    },

    changeCurrentConversation(state, action) {
      return action.payload.conversationId;
    },
  },
});

export const { changeAlert } = currentConversationSlice.actions;
export default currentConversationSlice.reducer;
