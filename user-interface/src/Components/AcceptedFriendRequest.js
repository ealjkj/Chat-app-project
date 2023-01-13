import { Box, Snackbar, Typography, IconButton } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import ClearIcon from "@mui/icons-material/Clear";
import { changeFriendRequestAccepted } from "../slices/friendRequestAccepted.slice";

export default function AcceptedFriendRequest() {
  const dispatch = useDispatch();
  const friendRequestAccepted = useSelector(
    (state) => state.friendRequestAccepted
  );

  const closeSnackBar = () => {
    dispatch(changeFriendRequestAccepted({ targetUser: null }));
  };

  return (
    <>
      <Snackbar
        open={Boolean(friendRequestAccepted)}
        autoHideDuration={6000}
        onClose={closeSnackBar}
        message={
          <Box>
            <Typography
              sx={{ display: "inline", fontWeight: "bold" }}
              color="primary"
            >
              {friendRequestAccepted?.username}
            </Typography>{" "}
            <Typography sx={{ display: "inline", fontWeight: "100" }}>
              accepted your friend Request!
            </Typography>
          </Box>
        }
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        action={
          <Box sx={{ display: "flex", gap: 1 }}>
            <IconButton onClick={closeSnackBar}>
              <ClearIcon />
            </IconButton>
          </Box>
        }
      />
    </>
  );
}
