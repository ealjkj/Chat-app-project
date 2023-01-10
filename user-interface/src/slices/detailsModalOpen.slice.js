import { createSlice } from "@reduxjs/toolkit";

const initialState = false;

const detailsModalOpenSlice = createSlice({
  name: "detailsModalOpen",
  initialState,
  reducers: {
    openDetailsModal(state, action) {
      return true;
    },

    closeDetailsModal(state, action) {
      return false;
    },
  },
});

export const { openDetailsModal, closeDetailsModal } =
  detailsModalOpenSlice.actions;
export default detailsModalOpenSlice.reducer;
