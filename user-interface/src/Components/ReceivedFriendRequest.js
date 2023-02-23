import { Box, Snackbar, Button, Typography, IconButton } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import ClearIcon from "@mui/icons-material/Clear";
import { changeFriendRequestReceived } from "../slices/friendRequestReceived.slice";

export default function ReceivedFriendRequest() {
  const dispatch = useDispatch();
  const friendRequestReceived = useSelector(
    (state) => state.friendRequestReceived
  );

  const closeSnackBar = () => {
    dispatch(changeFriendRequestReceived({ sourceUser: null }));
  };

  const acceptFriend = () => {
    console.log(
      "Accepting friend. friendRequestReceived:",
      friendRequestReceived
    );
    dispatch({
      type: "ACCEPT_FRIEND",
      payload: { friend: friendRequestReceived },
    });
    closeSnackBar();
  };
  const rejectFriend = () => {
    console.log(
      "Rejecting friend friend. friendRequestReceived:",
      friendRequestReceived
    );
    dispatch({
      type: "REJECT_FRIEND",
      payload: { friend: friendRequestReceived },
    });
    closeSnackBar();
  };

  return (
    <>
      <Snackbar
        open={Boolean(friendRequestReceived)}
        autoHideDuration={6000}
        onClose={closeSnackBar}
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
            <IconButton onClick={closeSnackBar}>
              <ClearIcon />
            </IconButton>
          </Box>
        }
      />
    </>
  );
}
