import { Box, ListItem, ListItemText } from "@mui/material";

const MessageItem = ({ message }) => {
  const color = message.from === "me" ? "#999" : "#eee";
  const align = message.from === "me" ? "flex-end" : "flex-start";
  return (
    <Box sx={{ maxWidth: "70%", width: "max-content", alignSelf: align }}>
      <ListItem sx={{ padding: 0 }}>
        <ListItemText
          primary={message.from}
          secondary={message.content}
          sx={{ backgroundColor: color, borderRadius: 2, padding: 1 }}
        />
      </ListItem>
    </Box>
  );
};

export default MessageItem;
