import { Stack, List } from "@mui/material";
import { useSelector } from "react-redux";
import MessageItem from "./MessageItem";
import TypingArea from "./TypingArea";

const MessagesSection = () => {
  const messages = useSelector((state) => state.messages);
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
        {messages.map((message, index) => (
          <MessageItem message={message} key={index} />
        ))}
      </List>
      <TypingArea />
    </Stack>
  );
};

export default MessagesSection;
