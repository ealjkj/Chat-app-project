import { Box, Button, InputBase, Typography } from "@mui/material";
import AddToConversationList from "./AddToConversationList";
import AddedParticipantsChips from "./AddedParticipantsChips.js";
import SearchBar from "./SearchBar";
import { useDispatch, useSelector } from "react-redux";
import { gql, useMutation } from "@apollo/client";
import { useState } from "react";

const CREATE_CONVERSATION = gql`
  mutation ($conversationInput: ConversationInput) {
    createConversation(conversationInput: $conversationInput) {
      _id
    }
  }
`;

export default function CreateConversationModal({
  existingConversation = null,
}) {
  const [conversationTitle, setConversationTitle] =
    useState("New Conversation");

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
    dispatch({ type: "CLOSE_MODAL" });
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
    dispatch({
      type: "CHANGE_MODAL_SEARCH",
      payload: { value: event.target.value },
    });
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
        label="Search Friends"
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
        {existingConversation ? "Add Participants" : "Create conversation"}
      </Button>
    </Box>
  );
}
