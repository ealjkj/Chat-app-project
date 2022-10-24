import {
  Box,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  IconButton,
  Divider,
} from "@mui/material";

import MoreVertIcon from "@mui/icons-material/MoreVert";
// import ChatIcon from "@mui/icons-material/Chat";
// import PersonRemoveIcon from "@mui/icons-material/PersonRemove";

const FriendItem = ({ friend }) => {
  return (
    <Box>
      <ListItem>
        <ListItemAvatar>
          <Avatar src={friend.avatar} />
        </ListItemAvatar>

        <ListItemText
          primary={friend.firstName + " " + friend.lastName}
          secondary={friend.username}
        />
        <IconButton>
          <MoreVertIcon />
        </IconButton>
      </ListItem>
      <Divider />
    </Box>
  );
};

export default FriendItem;
