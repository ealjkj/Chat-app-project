import { Grid } from "@mui/material";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ConversationsList from "./ConversationsList";
import MessagesSection from "./MessagesSection";
import { useQuery, gql } from "@apollo/client";

const GET_MESSAGES = gql`
  query GetMessages {
    messages {
      text
      from
    }
  }
`;

const Conversation = () => {
  const params = useParams();
  const conversationId = params.conversationId;
  const { loading, error, data } = useQuery(GET_MESSAGES);
  const [chats, setChats] = useState(data);
  const [conversations, setConversations] = useState([]);
  // const [messages, setMessages] = useState([
  //   {
  //     from: `User ${conversationId}`,
  //     content: "This is a simple message",
  //     type: "text",
  //     createdAt: "2013-10-21T13:28:06.419Z",
  //   },
  // ]);

  useEffect(() => {
    fetch("../conversations.json")
      .then((response) => response.json())
      .then((data) => {
        return setConversations(data);
      });
  }, []);

  // useEffect(() => {
  //   if (conversationId === "1") {
  //     fetch("../messages.luis.json")
  //       .then((response) => response.json())
  //       .then((data) => {
  //         return setMessages(data);
  //       });
  //   } else return;
  // }, []);

  if (loading) return <h1> Loading </h1>;
  // if (Error) return <h1> Error </h1>;

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
        <MessagesSection messagesList={data.messages} />
      </Grid>
    </Grid>
  );
};

export default Conversation;
