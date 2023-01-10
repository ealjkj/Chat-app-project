import { Stack, List, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import FriendRequestItem from "./FriendRequestItem";

const FriendRequestsList = ({ maxHeight = "80vh" }) => {
  const friendRequests = useSelector((state) => state.user.friendRequests);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch({ type: "QUERY_FRIEND_REQUESTS" });
  }, []);

  return (
    <Stack sx={{ height: "100%" }}>
      <Typography sx={{ alignSelf: "center", fontWeight: 600 }} variant="h6">
        {t("friendRequests")} ({friendRequests.length})
      </Typography>
      <List
        sx={{
          width: "100%",
          maxHeight,
          overflowY: "scroll",
        }}
      >
        {friendRequests.map((user) => (
          <FriendRequestItem user={user} key={user.username} />
        ))}
      </List>
    </Stack>
  );
};

export default FriendRequestsList;
