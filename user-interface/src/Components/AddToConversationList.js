import FriendToJoinItem from "./FriendToJoinItem";
import { Stack, List } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

const AddToConversationList = ({ notInclude = [] }) => {
  const dispatch = useDispatch();
  const hasFriends = useSelector((state) => state.user.friends.length);
  const userId = useSelector((state) => state.user._id);
  const friends = useSelector((state) => state.friends);
  const participantsToAdd = useSelector((state) => state.participantsToAdd);
  const friendSearcher = useSelector((state) =>
    state.modalSearcher.toLowerCase()
  );

  const filteredFriends = friends.filter((friend) => {
    const containsSearch =
      friend.firstName.toLowerCase().includes(friendSearcher) ||
      friend.lastName.toLowerCase().includes(friendSearcher) ||
      friend.username.toLowerCase().includes(friendSearcher);

    const alreadyAdded = participantsToAdd
      .map((participant) => participant._id)
      .includes(friend._id);

    const notToBeIncluded = notInclude
      .map((participant) => participant?._id)
      .includes(friend._id);

    return containsSearch && !alreadyAdded && !notToBeIncluded;
  });

  useEffect(() => {
    if (hasFriends && friends.length === 0) {
      dispatch({
        type: "QUERY_FRIENDS",
        payload: { fetchPolicy: "cache-first" },
      });
    }
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
          <FriendToJoinItem friend={friend} key={friend.username} />
        ))}
      </List>
    </Stack>
  );
};

export default AddToConversationList;
