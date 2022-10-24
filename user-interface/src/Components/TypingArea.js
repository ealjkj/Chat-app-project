import {
  Stack,
  TextField,
  Typography,
  Button,
  IconButton,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
const TypingArea = () => {
  return (
    <Stack
      direction="row"
      sx={{
        boxSizing: "border-box",
        height: "70px",
        width: "100%",
        padding: "5px",
      }}
    >
      <TextField sx={{ flexGrow: 1, paddingRight: 2 }} />

      <IconButton>
        <SendIcon />
      </IconButton>
    </Stack>
  );
};

export default TypingArea;
