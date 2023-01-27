import { Stack, List, Typography, Paper } from "@mui/material";
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import MessageItem from "./MessageItem";
import TypingArea from "./TypingArea";
import ConversationHeader from "./ConversationHeader";
import { dateDisplay } from "../utils/timeFormat";

const MessagesSection = () => {
  const messages = useSelector((state) => state.messages);
  const language = useSelector((state) => state.language);
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
  }, [conversationId, currentConversation, dispatch]);

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
            ? dateDisplay(previousMessage.createdAt, { language })
            : null;

          const currentMessageDate = dateDisplay(message.createdAt, {
            language,
          });

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
