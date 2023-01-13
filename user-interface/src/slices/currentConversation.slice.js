import { createSlice } from "@reduxjs/toolkit";
import { resetState } from "../actions";

const initialState = null;

const currentConversationSlice = createSlice({
  name: "currentConversation",
  initialState,
  extraReducers: (builder) => builder.addCase(resetState, () => initialState),
  reducers: {
    changeMessages(state, action) {
      return action.payload.conversationId;
    },

    changeCurrentConversation(state, action) {
      return action.payload.conversationId;
    },
  },
});

export const { changeAlert, changeMessages } = currentConversationSlice.actions;
export default currentConversationSlice.reducer;
