import FriendItem from "./FriendItem";
import { Stack, List, Typography } from "@mui/material";

const FriendsList = ({ friends }) => {
  return (
    <Stack>
      <Typography sx={{ alignSelf: "center", fontWeight: 600 }} variant="h6">
        Friends ({friends.length})
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
