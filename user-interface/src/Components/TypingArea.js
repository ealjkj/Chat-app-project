import {
  Stack,
  TextField,
  Typography,
  Button,
  IconButton,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
const TypingArea = () => {
  const [messageText, setMessage] = useState("");
  const userId = useSelector((state) => state.user._id);
  const dispatch = useDispatch();

  const handleChange = (event) => {
    setMessage(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch({
      type: "MUTATE_CREATE_MESSAGE",
      payload: { message: { from: userId, text: messageText } },
    });
    setMessage("");
  };

  return (
    <Stack
      direction="row"
      sx={{
        boxSizing: "border-box",
        height: "70px",
        width: "100%",
        padding: "5px",
      }}
      component="form"
      onSubmit={handleSubmit}
    >
      <TextField
        sx={{ flexGrow: 1, paddingRight: 2 }}
        onChange={handleChange}
        value={messageText}
      />

      <IconButton type="submit">
        <SendIcon />
      </IconButton>
    </Stack>
  );
};

export default TypingArea;
