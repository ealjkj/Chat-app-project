import { createSlice } from "@reduxjs/toolkit";

const initialState = false;

const modalOpenSlice = createSlice({
  name: "modalOpen",
  initialState,
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
