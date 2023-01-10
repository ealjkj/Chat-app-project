import { Box, Snackbar, Button, Typography, IconButton } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import ClearIcon from "@mui/icons-material/Clear";

export default function Notifications() {
  const dispatch = useDispatch();
  const friendRequestReceived = useSelector(
    (state) => state.friendRequestReceived
  );

  const handleCloseSnackBar = () => {
    dispatch({
      type: "CHANGE_FRIEND_REQUEST_RECEIVED",
      payload: { sourceUser: null },
    });
  };

  const acceptFriend = () =>
    dispatch({
      type: "ACCEPT_FRIEND",
      payload: { friend: friendRequestReceived },
    });

  const rejectFriend = () =>
    dispatch({
      type: "REJECT_FRIEND",
      payload: { friend: friendRequestReceived },
    });

  return (
    <>
      <Snackbar
        open={Boolean(friendRequestReceived)}
        autoHideDuration={6000}
        onClose={handleCloseSnackBar}
        message={
          <Box>
            <Typography
              sx={{ display: "inline", fontWeight: "bold" }}
              color="primary"
            >
              {friendRequestReceived?.username}
            </Typography>{" "}
            <Typography sx={{ display: "inline", fontWeight: "100" }}>
              sent you a friend request
            </Typography>
          </Box>
        }
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        action={
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button variant="contained" onClick={acceptFriend}>
              Confirm
            </Button>
            <Button variant="outlined" onClick={rejectFriend}>
              Delete
            </Button>
            <IconButton onClick={handleCloseSnackBar}>
              <ClearIcon />
            </IconButton>
          </Box>
        }
      />
    </>
  );
}
