import { useDispatch, useSelector } from "react-redux";
import { Box, Typography, Avatar, Button, IconButton } from "@mui/material";

export default function ConversationHeader() {
  const dispatch = useDispatch();
  const conversationId = useSelector((state) => state.currentConversation);
  const conversation = useSelector((state) =>
    state.conversations.find(
      (conversation) => conversation._id === conversationId
    )
  );

  const handleClick = () => {
    dispatch({ type: "OPEN_DETAILS_MODAL" });
  };

  return (
    <Box sx={{ display: "flex", padding: 1, alignItems: "center", gap: 2 }}>
      <IconButton onClick={handleClick}>
        <Avatar src={conversation?.avatars[0]} />
      </IconButton>
      <Typography>{conversation?.title}</Typography>
    </Box>
  );
}
