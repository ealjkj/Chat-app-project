import {
  Box,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  IconButton,
  Button,
  Divider,
} from "@mui/material";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useDispatch, useSelector } from "react-redux";
// import ChatIcon from "@mui/icons-material/Chat";
// import PersonRemoveIcon from "@mui/icons-material/PersonRemove";

const ParticipantItem = ({ friend, adminView }) => {
  const dispatch = useDispatch();
  const conversationId = useSelector((state) => state.currentConversation);
  const userId = useSelector((state) => state.user._id);
  const handleRemove = () => {
    dispatch({
      type: "QUERY_REMOVE_PARTICIPANT",
      payload: { conversationId, participantId: friend._id, myId: userId },
    });
  };
  return (
    <Box>
      <ListItem
        sx={{ backgroundColor: userId === friend._id ? "#dedede" : "fff" }}
      >
        <ListItemAvatar>
          <Avatar src={friend.avatar} />
        </ListItemAvatar>

        <ListItemText
          primary={friend.firstName + " " + friend.lastName}
          secondary={friend.username}
        />
        {adminView && userId !== friend._id ? (
          <Button variant="outlined" onClick={handleRemove}>
            Remove
          </Button>
        ) : null}
      </ListItem>
      <Divider />
    </Box>
  );
};

export default ParticipantItem;
