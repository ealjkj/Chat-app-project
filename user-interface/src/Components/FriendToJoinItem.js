import {
  Box,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  IconButton,
  Divider,
  Chip,
} from "@mui/material";
import { useDispatch } from "react-redux";

const FriendToJoinItem = ({ friend }) => {
  const dispatch = useDispatch();

  const createHandler = (friend) => {
    return () => {
      dispatch({
        type: "ADD_PARTICIPANT",
        payload: { participant: friend },
      });
    };
  };
  return (
    <Box>
      <ListItem
        component="button"
        data-id={friend._id}
        onClick={createHandler(friend)}
      >
        <ListItemAvatar>
          <Avatar src={friend.avatar} />
        </ListItemAvatar>

        <ListItemText
          primary={friend.firstName + " " + friend.lastName}
          secondary={friend.username}
        />
      </ListItem>
      <Divider />
    </Box>
  );
};

export default FriendToJoinItem;
