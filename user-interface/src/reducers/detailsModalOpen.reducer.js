export default function detailsModalOpen(state = false, action) {
  switch (action.type) {
    case "OPEN_DETAILS_MODAL":
      return true;
    case "CLOSE_DETAILS_MODAL":
      return false;
    default:
      return state;
  }
}
