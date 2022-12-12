import { Avatar, Box, Chip, ListItem } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

function AddedParticipantsChips() {
  const dispatch = useDispatch();
  const createDeleter = (participant) => {
    return () => {
      dispatch({
        type: "REMOVE_PARTICIPANT",
        payload: { userId: participant._id },
      });
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
