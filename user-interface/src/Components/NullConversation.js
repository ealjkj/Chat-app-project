import { Box, Icon, Typography } from "@mui/material";
import { useSelector } from "react-redux";

import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import { useTranslation } from "react-i18next";

export default function NullConversation() {
  const { t } = useTranslation();
  const user = useSelector((state) => state.user);
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        padding: 4,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography variant="h3">
        {" "}
        {t("welcome")} {user.firstName}
      </Typography>
      <Icon sx={{ height: 200, width: "100%" }}>
        <QuestionAnswerIcon
          sx={{ fontSize: 200, opacity: 0.4 }}
          color="secondary"
        />
      </Icon>
    </Box>
  );
}
