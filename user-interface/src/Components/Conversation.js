import { Box, Typography, Grid, Stack, Container } from "@mui/material";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ConversationsList from "./ConversationsList";
import MessagesSection from "./MessagesSection";

const Conversation = () => {
  const params = useParams();
  const conversationId = params.conversationId;

  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([
    {
      from: `User ${conversationId}`,
      content: "This is a simple message",
      type: "text",
      createdAt: "2013-10-21T13:28:06.419Z",
    },
  ]);
  useEffect(() => {
    fetch("../conversations.json")
      .then((response) => response.json())
      .then((data) => {
        return setConversations(data);
      });
  }, []);

  useEffect(() => {
    if (conversationId === "1") {
      fetch("../messages.luis.json")
        .then((response) => response.json())
        .then((data) => {
          return setMessages(data);
        });
    } else return;
  }, []);

  return (
    <Grid container>
      <Grid
        item
        md={3}
        sx={{
          height: "calc( 100vh - 64px)",
          overflowY: "scroll",
        }}
      >
        <ConversationsList conversations={conversations} />
      </Grid>

      <Grid item md={9}>
        <MessagesSection messages={messages} />
      </Grid>
    </Grid>
  );
};

export default Conversation;
