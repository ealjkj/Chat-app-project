import { Box, Button, Typography, Avatar, Modal } from "@mui/material";
import SearchBar from "./SearchBar";
import PartipantsList from "./ParticipantsList";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import CreateConversationModal from "./CreateConversationModal";
import { closeDetailsModal } from "../slices/detailsModalOpen.slice";
import { changeModalSearch } from "../slices/modalSearcher.slice";
import {
  closeExtraModal,
  openExtraModal,
} from "../slices/extraParticipantsModalOpen.slice";
import { useTranslation } from "react-i18next";

export default function DetailsModal() {
  const dispatch = useDispatch();
  const { t } = useTranslation();
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
    if (!conversation) dispatch(closeDetailsModal());
  }, [conversation, dispatch]);

  const handleChange = (event) => {
    dispatch(changeModalSearch({ value: event.target.value }));
  };

  const handleClose = () => {
    dispatch(closeExtraModal());
  };

  const handleLeave = () => {
    dispatch({ type: "LEAVE_CONVERSATION", payload: { conversationId } });
    dispatch(closeDetailsModal());
  };

  const handleAdd = () => {
    dispatch(openExtraModal());
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
          label={t("searchFriends")}
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
          {t("addParticipant")}
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
          {t("leaveConversation")}
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
