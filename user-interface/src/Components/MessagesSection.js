import { Stack, List, Box, Typography, Paper } from "@mui/material";
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import MessageItem from "./MessageItem";
import TypingArea from "./TypingArea";
import ConversationHeader from "./ConversationHeader";
import { format } from "date-fns";

const MessagesSection = () => {
  const messages = useSelector((state) => state.messages);
  const [scrolled, setScrolled] = useState(true);
  const messagesEnd = useRef(null);
  const messagesSection = useRef(null);

  const { conversationId } = useParams();
  const currentConversation = useSelector((state) => state.currentConversation);
  const dispatch = useDispatch();

  useEffect(() => {
    if (currentConversation !== conversationId) {
      dispatch({ type: "CHANGE_CONVERSATION", payload: { conversationId } });
    }
  }, [conversationId, currentConversation]);

  useEffect(() => {
    if (scrolled) {
      messagesEnd.current?.scrollIntoView();
    }
  }, [messages]);

  const handleScroll = (event) => {
    const element = event.target;
    setScrolled(
      element.scrollHeight - element.scrollTop - element.clientHeight <= 5
    );
  };
  return (
    <Stack>
      <Paper
        sx={{
          position: "fixed",
          // backgroundColor: "pink",
          width: "100%",
          zIndex: 1,
        }}
      >
        <ConversationHeader />
      </Paper>
      <List
        ref={messagesSection}
        disablePadding
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "calc( 100vh - 64px - 70px)",
          overflowY: "scroll",
          paddingTop: "80px",
          boxSizing: "border-box",
          paddingX: 5,
        }}
        onScroll={handleScroll}
      >
        {messages.flatMap((message, index) => {
          const previousMessage = index !== 0 ? messages[index - 1] : null;

          const previousMessageDate = previousMessage
            ? format(new Date(previousMessage.createdAt), "P")
            : null;

          const currentMessageDate = format(new Date(message.createdAt), "P");
          const messageNode = (
            <MessageItem message={message} key={message._id} />
          );

          if (previousMessageDate !== currentMessageDate) {
            return [
              <Typography sx={{ alignSelf: "center" }} key={index}>
                {currentMessageDate}
              </Typography>,
              messageNode,
            ];
          }

          return messageNode;
        })}

        <div ref={messagesEnd} className="messages-end"></div>
      </List>
      <TypingArea />
    </Stack>
  );
};

export default MessagesSection;
