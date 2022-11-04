import { Grid } from "@mui/material";
import { useParams } from "react-router-dom";
import ConversationsList from "./ConversationsList";
import MessagesSection from "./MessagesSection";

const Conversation = () => {
  const { conversationId } = useParams();

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
