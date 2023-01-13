import {
  Box,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Button,
  Divider,
} from "@mui/material";
import { useTranslation } from "react-i18next";

import { useDispatch, useSelector } from "react-redux";

const ParticipantItem = ({ friend, adminView }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const conversationId = useSelector((state) => state.currentConversation);
  const userId = useSelector((state) => state.user._id);
  const handleRemove = () => {
    dispatch({
      type: "QUERY_REMOVE_PARTICIPANT",
      payload: { conversationId, participantId: friend._id, myId: userId },
    });
  };
  return (
    <Box>
      <ListItem
        sx={{ backgroundColor: userId === friend._id ? "#dedede" : "fff" }}
      >
        <ListItemAvatar>
          <Avatar src={friend.avatar} />
        </ListItemAvatar>

        <ListItemText
          primary={friend.firstName + " " + friend.lastName}
          secondary={friend.username}
        />
        {adminView && userId !== friend._id ? (
          <Button variant="outlined" onClick={handleRemove}>
            {t("remove")}
          </Button>
        ) : null}
      </ListItem>
      <Divider />
    </Box>
  );
};

export default ParticipantItem;
