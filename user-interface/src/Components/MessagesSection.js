import { Stack, Typography, List } from "@mui/material";
import MessageItem from "./MessageItem";
import TypingArea from "./TypingArea";
const MessagesSection = ({ messages }) => {
  return (
    <Stack sx={{ paddingX: 5 }}>
      <List
        disablePadding
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "calc( 100vh - 64px - 70px)",
          overflowY: "scroll",
        }}
      >
        {messages.map((message) => (
          <MessageItem message={message} key={message.id} />
        ))}
      </List>
      <TypingArea />
    </Stack>
  );
};

export default MessagesSection;
