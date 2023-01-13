import {
  Box,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Divider,
  ListItemButton,
} from "@mui/material";

import { Link as RouterLink } from "react-router-dom";

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
            secondary={conversation.lastMessage.content}
          />
        </ListItemButton>
      </ListItem>
      <Divider />
    </Box>
  );
};

export default ConversationItem;
