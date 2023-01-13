import { createSlice } from "@reduxjs/toolkit";
import { resetState } from "../actions";

const initialState = null;

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  extraReducers: (builder) => builder.addCase(resetState, () => initialState),
  reducers: {
    changeNotification(state, action) {
      return action.payload.notification;
    },
  },
});

export const { changeNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
