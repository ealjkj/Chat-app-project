export default function extraParticipantsModalOpen(state = false, action) {
  switch (action.type) {
    case "OPEN_EXTRA_MODAL":
      return true;
    case "CLOSE_EXTRA_MODAL":
      return false;
    default:
      return state;
  }
}
