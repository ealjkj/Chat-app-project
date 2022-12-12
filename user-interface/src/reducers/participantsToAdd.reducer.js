export default function participantsToAdd(state = [], action) {
  switch (action.type) {
    case "ADD_PARTICIPANT":
      if (
        state
          .map((element) => element._id)
          .includes(action.payload.participant._id)
      ) {
        return state;
      }
      return [...state, action.payload.participant];
    case "REMOVE_PARTICIPANT":
      return state.filter((element) => element._id !== action.payload.userId);
    default:
      return state;
  }
}
