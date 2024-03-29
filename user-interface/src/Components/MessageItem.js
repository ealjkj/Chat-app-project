import { Box, ListItem, ListItemText, Typography } from "@mui/material";
import { timeDisplay } from "../utils/timeFormat";
import { useSelector } from "react-redux";
import { Fragment } from "react";

const MessageItem = ({ message }) => {
  const language = useSelector((state) => state.language);
  const userId = useSelector((state) => state.user._id);

  const color = message.from === userId ? "#999" : "#eee";
  const align = message.from === userId ? "flex-end" : "flex-start";

  return (
    <Box sx={{ maxWidth: "70%", width: "max-content", alignSelf: align }}>
      <ListItem sx={{ padding: 0 }}>
        <ListItemText
          primary={message.authorName}
          secondary={
            <Fragment>
              <Typography
                sx={{ display: "inline" }}
                component="span"
                variant="body2"
                color="text.primary"
              >
                {message.content}
              </Typography>
              {" — " + timeDisplay(message.createdAt, { language })}
            </Fragment>
          }
          sx={{
            backgroundColor: color,
            borderRadius: 2,
            padding: 1,
            overflowWrap: "break-word",
          }}
        />
      </ListItem>
    </Box>
  );
};

export default MessageItem;
