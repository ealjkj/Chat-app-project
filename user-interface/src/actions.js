import { changeAlert } from "./slices/alert.slice";
import { createAction } from "@reduxjs/toolkit";

export const defaultErrorAlert = () =>
  changeAlert({
    severity: "error",
    message: "Something went wrong. Please try again in a few minutes",
  });

export const resetState = createAction("RESET_STATE");
