import { createSlice } from "@reduxjs/toolkit";
import { resetState } from "../actions";

const initialState = [];

const participantsToAddSlice = createSlice({
  name: "participantsToAdd",
  initialState,
  extraReducers: (builder) => builder.addCase(resetState, () => initialState),
  reducers: {
    addParticipant(state, action) {
      if (
        state
          .map((element) => element._id)
          .includes(action.payload.participant._id)
      ) {
        return state;
      }
      return [...state, action.payload.participant];
    },

    removeParticipant(state, action) {
      return state.filter((element) => element._id !== action.payload.userId);
    },
  },
});

export const { addParticipant, removeParticipant } =
  participantsToAddSlice.actions;
export default participantsToAddSlice.reducer;
