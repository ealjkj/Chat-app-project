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

export default function CreateConversationModal(addParticipants = false) {
  const dispatch = useDispatch();
  const participantsToAdd = useSelector((state) => state.participantsToAdd);
  const modalSearcher = useSelector((state) => state.modalSearcher);
  const creatorId = useSelector((state) => state.user._id);
  const [createConversation] = useMutation(CREATE_CONVERSATION);
  const conversation = useSelector((state) =>
    state.currentConversation.find(
      (conversation) => conversation._id === state.currentConversation
    )
  );

  const handleApplyChanges = () => {
    const participants = participantsToAdd
      .map((participant) => ({ userId: participant._id }))
      .concat([{ userId: creatorId }]);

    dispatch({ type: "QUERY_ADD_PARTICIPANTS", payload: { participants } });
    dispatch({ type: "CLOSE_MODAL" });
  };

  const handleChange = (event) => {
    dispatch({
      type: "CHANGE_MODAL_SEARCH",
      payload: { value: event.target.value },
    });
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
      <Typography sx={{ fontWeight: 600, fontSize: 24 }}>
        {conversation.title}
      </Typography>
      <SearchBar
        label="Search Friends"
        value={modalSearcher}
        menu={false}
        onChange={handleChange}
      />
      <AddedParticipantsChips />
      <AddToConversationList notInclude={conversation.members} />
      <Button
        onClick={handleApplyChanges}
        variant="contained"
        sx={{ width: "50%", alignSelf: "flex-end" }}
      >
        Add participants
      </Button>
    </Box>
  );
}
