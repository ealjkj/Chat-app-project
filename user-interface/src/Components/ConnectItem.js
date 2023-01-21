import {
  Box,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  IconButton,
  Divider,
  Typography,
} from "@mui/material";

import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { useDispatch, useSelector } from "react-redux";

const ConnectItem = ({ user }) => {
  const dispatch = useDispatch();
  const friends = useSelector((state) => state.user.friends);
  const userId = useSelector((state) => state.user._id);
  const searcher = useSelector((state) => state.searcher);
  const sendFriendRequest = () => {
    if (user.requestSent) return;
    dispatch({ type: "SEND_FRIEND_REQUEST", payload: { user, myId: userId } });
    dispatch({ type: "DISCOVER_USERS", payload: { search: searcher } });
  };

  const AddButton = () => {
    return (
      <IconButton onClick={sendFriendRequest}>
        <PersonAddIcon />
      </IconButton>
    );
  };

  let AddTextOrButton = AddButton;
  if (friends.includes(user._id)) {
    AddTextOrButton = () => <Typography>Friends</Typography>;
  } else {
    AddTextOrButton = user.requestSent
      ? () => <Typography>Request Sent</Typography>
      : AddButton;
  }

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
        <AddTextOrButton />
      </ListItem>
      <Divider />
    </Box>
  );
};

export default ConnectItem;
