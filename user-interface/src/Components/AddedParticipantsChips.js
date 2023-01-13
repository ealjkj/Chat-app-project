import { Avatar, Box, Chip } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { removeParticipant as removeParticipantConv } from "../slices/conversations.slice";
import { removeParticipant } from "../slices/participantsToAdd.slice";

function AddedParticipantsChips() {
  const dispatch = useDispatch();
  const createDeleter = (participant) => {
    return () => {
      dispatch(removeParticipant({ userId: participant._id }));
      dispatch(removeParticipantConv({ userId: participant._id }));
    };
  };

  const participants = useSelector((state) => state.participantsToAdd);
  return (
    <Box>
      {participants.map((participant) => (
        <Chip
          key={participant._id}
          avatar={<Avatar src={participant.avatar} />}
          label={participant.firstName}
          onDelete={createDeleter(participant)}
        />
      ))}
    </Box>
  );
}

export default AddedParticipantsChips;
