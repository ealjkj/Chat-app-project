import {
  Box,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  IconButton,
  Divider,
} from "@mui/material";

import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import { useDispatch, useSelector } from "react-redux";

const FriendRequestItem = ({ user }) => {
  const userId = useSelector((state) => state.user._id);
  const dispatch = useDispatch();

  const acceptFriend = () =>
    dispatch({
      type: "ACCEPT_FRIEND",
      payload: { friend: user, myId: userId },
    });
  const rejectFriend = () =>
    dispatch({
      type: "REJECT_FRIEND",
      payload: { friend: user, myId: userId },
    });

  return (
    <Box>
      <ListItem>
        <ListItemAvatar>
          <Avatar src={user.avatar} />
        </ListItemAvatar>

        <ListItemText
          primary={user.firstName + " " + user.lastName}
          secondary={user.username}
        />
        <IconButton color="success" onClick={acceptFriend}>
          <CheckIcon />
        </IconButton>
        <IconButton color="error" onClick={rejectFriend}>
          <ClearIcon />
        </IconButton>
      </ListItem>
      <Divider />
    </Box>
  );
};

export default FriendRequestItem;
