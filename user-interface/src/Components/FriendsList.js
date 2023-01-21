import FriendItem from "./FriendItem";
import { Stack, List, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const FriendsList = ({ maxHeight = "80vh" }) => {
  const dispatch = useDispatch();
  const friends = useSelector((state) => state.friends);
  const { t } = useTranslation();

  useEffect(() => {
    dispatch({ type: "QUERY_FRIENDS" });
  }, []);

  return (
    <Stack sx={{ height: "100%" }}>
      <Typography sx={{ alignSelf: "center", fontWeight: 600 }} variant="h6">
        {t("friends")} ({friends.length})
      </Typography>
      <List
        sx={{
          width: "100%",
          maxHeight,
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
