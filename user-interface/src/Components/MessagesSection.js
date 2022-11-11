import { Stack, List } from "@mui/material";
import { useEffect } from "react";
import { useRef } from "react";
import { useSelector } from "react-redux";
import MessageItem from "./MessageItem";
import TypingArea from "./TypingArea";

const MessagesSection = () => {
  const messages = useSelector((state) => state.messages);
  const messagesEnd = useRef(null);

  useEffect(() => {
    console.log(messagesEnd.current);
    messagesEnd.current?.scrollIntoView();
  }, [messages]);

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

        <div ref={messagesEnd} className="messages-end"></div>
      </List>
      <TypingArea />
    </Stack>
  );
};

export default MessagesSection;
