import { changeAlert } from "./slices/alert.slice";

export const defaultErrorAlert = changeAlert({
  severity: "error",
  message: "Something went wrong. Please try again in a few minutes",
});
