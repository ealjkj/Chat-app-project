import { Stack, List, Typography } from "@mui/material";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import ConversationItem from "./ConversationItem";

const ConversationsList = () => {
  const dispatch = useDispatch();
  const hasFriends = useSelector((state) => state.user.friends.length);
  const userId = useSelector((state) => state.user._id);
  const conversations = useSelector((state) => state.conversations);

  useEffect(() => {
    if (hasFriends && conversations.length === 0) {
      dispatch({ type: "QUERY_MORE_CONVERSATIONS", payload: { userId } });
    }
  }, []);

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
          <ConversationItem
            conversation={conversation}
            key={conversation._id}
          />
        ))}
      </List>
    </Stack>
  );
};

export default ConversationsList;
