import {
  Box,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  IconButton,
  Divider,
  ListItemButton,
} from "@mui/material";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useParams } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";

// import ChatIcon from "@mui/icons-material/Chat";
// import PersonRemoveIcon from "@mui/icons-material/PersonRemove";

const ConversationItem = ({ conversation }) => {
  return (
    <Box>
      <ListItem
        disablePadding
        component={RouterLink}
        to={`/user/conversation/${conversation._id}`}
      >
        <ListItemButton>
          <ListItemAvatar>
            <Avatar src={conversation.avatars[0]} />
          </ListItemAvatar>

          <ListItemText
            primary={conversation.title}
            secondary={conversation.message}
          />
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </ListItemButton>
      </ListItem>
      <Divider />
    </Box>
  );
};

export default ConversationItem;
