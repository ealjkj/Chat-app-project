import { Stack, List, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import ConversationItem from "./ConversationItem";

const ConversationsList = ({ conversations }) => {
  return (
    <Stack>
      <Typography sx={{ alignSelf: "center", fontWeight: 600 }} variant="h6">
        Conversations
      </Typography>
      <List
        sx={{
          width: "100%",
        }}
      >
        {conversations.map((conversation) => (
          <ConversationItem conversation={conversation} key={conversation.id} />
        ))}
      </List>
    </Stack>
  );
};

export default ConversationsList;
