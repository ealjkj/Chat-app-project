import { Stack, List } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import ConversationItem from "./ConversationItem";
import { useEffect } from "react";

const ConversationsList = () => {
  const dispatch = useDispatch();
  const search = useSelector((state) => state.searcher);
  const messages = useSelector((state) => state.messages);
  useEffect(() => {
    dispatch({
      type: "QUERY_CONVERSATIONS",
      payload: { fetchPolicy: "cache-first" },
    });
  }, [messages, dispatch]);

  const conversations = useSelector((state) => state.conversations);
  const filteredConversations = conversations.filter((conversation) =>
    conversation.title.toUpperCase().includes(search.toUpperCase())
  );

  const sortedConversations = [...filteredConversations].sort(
    (conv1, conv2) => {
      const timeToCompare1 = conv1.lastMessage.createdAt
        ? conv1.lastMessage.createdAt
        : conv1.joinedAt;

      const timeToCompare2 = conv2.lastMessage.createdAt
        ? conv2.lastMessage.createdAt
        : conv2.joinedAt;

      return new Date(timeToCompare2) - new Date(timeToCompare1);
    }
  );

  return (
    <Stack>
      <List
        sx={{
          width: "100%",
        }}
      >
        {sortedConversations.map((conversation) => (
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
