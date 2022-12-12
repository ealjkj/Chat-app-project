import {
  Box,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  IconButton,
  Divider,
} from "@mui/material";

import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";

const ConnectItem = ({ user }) => {
  const dispatch = useDispatch();
  const friends = useSelector((state) => state.user.friends);
  const userId = useSelector((state) => state.user._id);
  const sendFriendRequest = () => {
    if (user.requestSent) return;
    dispatch({ type: "SEND_FRIEND_REQUEST", payload: { user, myId: userId } });
    setColor("primary");
  };

  let initialColor = "default";
  if (friends.includes(user._id)) {
    initialColor = "success";
  } else {
    initialColor = user.requestSent ? "primary" : "default";
  }

  const [color, setColor] = useState(initialColor);
  return (
    <Box>
      <ListItem>
        <ListItemAvatar>
          <Avatar src={user.avatar} />
        </ListItemAvatar>

        <ListItemText
          primary={user.firstName + " " + user.lastName}
          secondary={user.email}
        />
        {userId === user._id ? null : (
          <IconButton onClick={sendFriendRequest} color={color}>
            <PersonAddIcon />
          </IconButton>
        )}
      </ListItem>
      <Divider />
    </Box>
  );
};

export default ConnectItem;
