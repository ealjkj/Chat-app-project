import { createSlice } from "@reduxjs/toolkit";
import { resetState } from "../actions";

const initialState = false;

const extraParticipantsModalOpenSlice = createSlice({
  name: "extraParticipantsModalOpen",
  initialState,
  extraReducers: (builder) => builder.addCase(resetState, () => initialState),
  reducers: {
    openExtraModal() {
      return true;
    },
    closeExtraModal() {
      return false;
    },
  },
});

export const { openExtraModal, closeExtraModal } =
  extraParticipantsModalOpenSlice.actions;
export default extraParticipantsModalOpenSlice.reducer;
