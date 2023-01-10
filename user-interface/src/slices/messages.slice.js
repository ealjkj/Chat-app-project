import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    changeMessages(state, action) {
      return action.payload.messages;
    },
    addMessage(state, action) {
      return [...state, action.payload.message];
    },
  },
});

export const { changeMessages, addMessage } = messagesSlice.actions;
export default messagesSlice.reducer;
