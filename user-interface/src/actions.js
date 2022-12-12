export const defaultErrorAlert = () => ({
  type: "CHANGE_ALERT",
  payload: {
    severity: "error",
    message: "Something went wrong. Please try again in a few minutes",
  },
});
