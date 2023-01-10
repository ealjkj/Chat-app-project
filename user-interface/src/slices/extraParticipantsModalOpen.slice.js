import { createSlice } from "@reduxjs/toolkit";

const initialState = false;

const extraParticipantsModalOpenSlice = createSlice({
  name: "extraParticipantsModalOpen",
  initialState,
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
