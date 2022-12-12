import { Fade, Alert } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";

const AlertBar = () => {
  const dispatch = useDispatch();
  const alert = useSelector((state) => state.alert);
  return (
    <Fade in={Boolean(alert.message)}>
      <Alert
        severity={alert.severity}
        variant="filled"
        onClose={() =>
          dispatch({ type: "CHANGE_ALERT", payload: { message: null } })
        }
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          boxSizing: "border-box",
          zIndex: 1,
        }}
      >
        {alert.message}
      </Alert>
    </Fade>
  );
};

export default AlertBar;
