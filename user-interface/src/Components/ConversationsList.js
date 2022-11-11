import { Stack, List, Typography } from "@mui/material";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import ConversationItem from "./ConversationItem";

const ConversationsList = () => {
  const { t } = useTranslation();
  const conversations = useSelector((state) => state.conversations);

  return (
    <Stack>
      <Typography sx={{ alignSelf: "center", fontWeight: 600 }} variant="h6">
        {t("conversations")}
      </Typography>
      <List
        sx={{
          width: "100%",
        }}
      >
        {conversations.map((conversation) => (
          <ConversationItem
            conversation={conversation}
            key={conversation._id}
          />
        ))}
      </List>
    </Stack>
  );
};

export default ConversationsList;
