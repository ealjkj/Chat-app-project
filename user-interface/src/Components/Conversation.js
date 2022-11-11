import { gql, useSubscription } from "@apollo/client";
import { Grid } from "@mui/material";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import ConversationsList from "./ConversationsList";
import MessagesSection from "./MessagesSection";

const MESSAGES_SUBSCRIPTION = gql`
  subscription messageCreated($conversationId: ID!) {
    messageCreated(conversationId: $conversationId) {
      from
      text
      conversationId
      authorName
      createdAt
    }
  }
`;

const Conversation = () => {
  const { conversationId } = useParams();
  const dispatch = useDispatch();

  useSubscription(MESSAGES_SUBSCRIPTION, {
    variables: { conversationId },
    onSubscriptionData: ({ subscriptionData }) => {
      const { data } = subscriptionData;
      const message = {
        ...data.messageCreated,
        content: data.messageCreated.text,
      };
      dispatch({ type: "ADD_MESSAGE", payload: { message } });
    },
  });

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
        <ConversationsList />
      </Grid>

      <Grid item md={9}>
        <MessagesSection />
      </Grid>
    </Grid>
  );
};

export default Conversation;
