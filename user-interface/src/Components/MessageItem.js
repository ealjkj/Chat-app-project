import { Box, ListItem, ListItemText } from "@mui/material";
import { useSelector } from "react-redux";

const MessageItem = ({ message }) => {
  const userId = useSelector((state) => state.user._id);

  const color = message.from === userId ? "#999" : "#eee";
  const align = message.from === userId ? "flex-end" : "flex-start";
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
