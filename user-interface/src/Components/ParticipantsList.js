import FriendItem from "./FriendItem";
import { Stack, List } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import ParticipantItem from "./ParticipantItem";

const ParticipantList = ({ participants }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const hasFriends = useSelector((state) => state.user.friends.length);
  const userId = useSelector((state) => state.user._id);
  const friendSearcher = useSelector((state) =>
    state.modalSearcher.toLowerCase()
  );
  const conversationId = useSelector((state) => state.currentConversation);
  const conversation = useSelector((state) =>
    state.conversations.find(
      (conversation) => conversation._id === conversationId
    )
  );

  const isUserAdmin = conversation.admins.includes(userId);

  const filteredFriends = participants.filter((friend) => {
    const containsSearch =
      friend.firstName.toLowerCase().includes(friendSearcher) ||
      friend.lastName.toLowerCase().includes(friendSearcher) ||
      friend.username.toLowerCase().includes(friendSearcher);

    return containsSearch;
  });

  useEffect(() => {
    dispatch({
      type: "QUERY_FRIENDS",
      payload: { fetchPolicy: "cache-first" },
    });
  }, []);

  return (
    <Stack sx={{ maxHeight: "60vh", height: "60vh", margin: "10px 0" }}>
      <List
        sx={{
          width: "100%",
          overflowY: "scroll",
        }}
      >
        {filteredFriends.map((friend) => (
          <ParticipantItem
            friend={friend}
            key={friend.username}
            adminView={isUserAdmin}
          />
        ))}
      </List>
    </Stack>
  );
};

export default ParticipantList;
