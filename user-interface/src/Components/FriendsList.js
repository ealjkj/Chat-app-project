import FriendItem from "./FriendItem";
import { Stack, List, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const FriendsList = () => {
  const dispatch = useDispatch();
  const hasFriends = useSelector((state) => state.user.friends.length);
  const userId = useSelector((state) => state.user._id);
  const friends = useSelector((state) => state.friends);
  const { t } = useTranslation();

  useEffect(() => {
    if (hasFriends && friends.length === 0) {
      dispatch({ type: "QUERY_MORE_FRIENDS", payload: { userId } });
    }
  }, []);

  return (
    <Stack>
      <Typography sx={{ alignSelf: "center", fontWeight: 600 }} variant="h6">
        {t("friends")} ({friends.length})
      </Typography>
      <List
        sx={{
          width: "100%",
          maxHeight: "80vh",
          overflowY: "scroll",
        }}
      >
        {friends.map((friend) => (
          <FriendItem friend={friend} key={friend.username} />
        ))}
      </List>
    </Stack>
  );
};

export default FriendsList;
