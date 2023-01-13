import { Box, Button, InputBase, Typography } from "@mui/material";
import AddToConversationList from "./AddToConversationList";
import AddedParticipantsChips from "./AddedParticipantsChips.js";
import SearchBar from "./SearchBar";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { closeModal } from "../slices/modalOpen.slice";
import { changeModalSearch } from "../slices/modalSearcher.slice";
import { useTranslation } from "react-i18next";

export default function CreateConversationModal({
  existingConversation = null,
}) {
  const { t } = useTranslation();
  const [conversationTitle, setConversationTitle] = useState(
    t("newConversation")
  );

  const dispatch = useDispatch();
  const participantsToAdd = useSelector((state) => state.participantsToAdd);
  const modalSearcher = useSelector((state) => state.modalSearcher);
  const creatorId = useSelector((state) => state.user._id);

  const handleCreation = () => {
    const conversationInput = {
      creatorId,
      title: conversationTitle,
      members: participantsToAdd
        .map((participant) => ({ userId: participant._id }))
        .concat([{ userId: creatorId }]),
    };

    dispatch({ type: "CREATE_CONVERSATION", payload: { conversationInput } });
    dispatch(closeModal());
  };

  const handleAddParticipants = () => {
    dispatch({
      type: "QUERY_ADD_PARTICIPANTS",
      payload: {
        conversationId: existingConversation._id,
        participants: participantsToAdd.map((user) => user._id),
      },
    });
  };
  const handleChange = (event) => {
    dispatch(changeModalSearch({ value: event.target.value }));
  };

  const handleTitleChange = (event) => {
    setConversationTitle(event.target.value);
  };

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
      {!existingConversation ? (
        <InputBase
          onChange={handleTitleChange}
          defaultValue={conversationTitle}
          sx={{ fontWeight: 600, fontSize: 24 }}
        />
      ) : (
        <Typography sx={{ fontWeight: 600, fontSize: 24 }}>
          {existingConversation.title}
        </Typography>
      )}
      <SearchBar
        label={t("searchFriends")}
        value={modalSearcher}
        menu={false}
        onChange={handleChange}
      />
      <AddedParticipantsChips />
      <AddToConversationList
        notInclude={existingConversation ? existingConversation.members : []}
      />
      <Button
        onClick={existingConversation ? handleAddParticipants : handleCreation}
        variant="contained"
        sx={{ width: "50%", alignSelf: "flex-end" }}
      >
        {existingConversation ? t("addParticipants") : t("createConversation")}
      </Button>
    </Box>
  );
}
