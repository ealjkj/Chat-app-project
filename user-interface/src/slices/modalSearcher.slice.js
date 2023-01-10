import { createSlice } from "@reduxjs/toolkit";

const initialState = "";

const modalSearcherSlice = createSlice({
  name: "modalSearcher",
  initialState,
  reducers: {
    changeModalSearch(state, action) {
      return action.payload.value;
    },
  },
});

export const { changeModalSearch } = modalSearcherSlice.actions;
export default modalSearcherSlice.reducer;
