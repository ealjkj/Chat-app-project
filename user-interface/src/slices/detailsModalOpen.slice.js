import { createSlice } from "@reduxjs/toolkit";
import { resetState } from "../actions";

const initialState = false;

const detailsModalOpenSlice = createSlice({
  name: "detailsModalOpen",
  initialState,
  extraReducers: (builder) => builder.addCase(resetState, () => initialState),
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
