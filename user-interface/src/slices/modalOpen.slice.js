import { createSlice } from "@reduxjs/toolkit";
import { resetState } from "../actions";

const initialState = false;

const modalOpenSlice = createSlice({
  name: "modalOpen",
  initialState,
  extraReducers: (builder) => builder.addCase(resetState, () => initialState),
  reducers: {
    openModal() {
      return true;
    },
    closeModal() {
      return false;
    },
  },
});

export const { openModal, closeModal } = modalOpenSlice.actions;
export default modalOpenSlice.reducer;
