import {
  Box,
  Button,
  InputBase,
  Typography,
  Avatar,
  Modal,
} from "@mui/material";
import SearchBar from "./SearchBar";
import PartipantsList from "./ParticipantsList";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import CreateConversationModal from "./CreateConversationModal";

export default function DetailsModal() {
  const dispatch = useDispatch();
  const extraParticipantsModalOpen = useSelector(
    (state) => state.extraParticipantsModalOpen
  );
  const modalSearcher = useSelector((state) => state.modalSearcher);
  const userId = useSelector((state) => state.user._id);
  const conversationId = useSelector((state) => state.currentConversation);
  const conversation = useSelector((state) =>
    state.conversations.find(
      (conversation) => conversation._id === conversationId
    )
  );

  useEffect(() => {
    if (!conversation) dispatch({ type: "CLOSE_DETAILS_MODAL" });
  }, [conversation]);

  const handleChange = (event) => {
    dispatch({
      type: "CHANGE_MODAL_SEARCH",
      payload: { value: event.target.value },
    });
  };

  const handleClose = () => {
    dispatch({ type: "CLOSE_EXTRA_MODAL" });
  };

  const handleLeave = () => {
    dispatch({ type: "LEAVE_CONVERSATION", payload: { conversationId } });
  };

  const handleAdd = () => {
    dispatch({ type: "OPEN_EXTRA_MODAL" });
  };

  if (!conversation) return <div>No conversation</div>;
  return (
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        bgcolor: "background.paper",
        boxShadow: 24,
        p: 4,
        width: "65%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography sx={{ fontWeight: 600, fontSize: 24 }}>
        {conversation.title}
      </Typography>

      {conversation.isOneOnOne ? (
        <Avatar
          sx={{ width: 200, height: 200, alignSelf: "center" }}
          src={
            conversation.members.find((member) => member._id !== userId).avatar
          }
        ></Avatar>
      ) : null}
      {conversation.isOneOnOne ? null : (
        <SearchBar
          label="Search Friends"
          value={modalSearcher}
          menu={false}
          onChange={handleChange}
        />
      )}
      {conversation.isOneOnOne ? null : (
        <Button
          sx={{ margin: 1, width: "50%", alignSelf: "center" }}
          variant="outlined"
          onClick={handleAdd}
        >
          Add Participant
        </Button>
      )}

      {conversation.isOneOnOne ? null : (
        <PartipantsList participants={conversation.members} />
      )}

      {conversation.isOneOnOne ? null : (
        <Button
          variant="contained"
          color="error"
          sx={{ width: "50%", alignSelf: "flex-end" }}
          onClick={handleLeave}
        >
          Leave Conversation
        </Button>
      )}

      <Modal open={extraParticipantsModalOpen} onClose={handleClose}>
        <div>
          <CreateConversationModal existingConversation={conversation} />
        </div>
      </Modal>
    </Box>
  );
}
