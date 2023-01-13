import { createSlice } from "@reduxjs/toolkit";
import { resetState } from "../actions";

const initialState = [];

const messagesSlice = createSlice({
  name: "messages",
  initialState,
  extraReducers: (builder) => builder.addCase(resetState, () => initialState),
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
