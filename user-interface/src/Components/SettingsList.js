import { Stack, List, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import SettingItem from "./SettingItem";
import LanguageIcon from "@mui/icons-material/Language";
import AccountBoxIcon from "@mui/icons-material/AccountBox";

export default function SettingsList() {
  const { t } = useTranslation();
  const settings = [
    {
      name: t("account"),
      redirect: "account",
      icon: AccountBoxIcon,
    },
    {
      name: t("language"),
      redirect: "language",
      icon: LanguageIcon,
    },
  ];

  return (
    <Stack sx={{ alignItems: "center" }}>
      <Typography sx={{ fontWeight: 600 }} variant="h6">
        {t("settings")}
      </Typography>
      <List
        sx={{
          width: "80%",
        }}
      >
        {settings.map((setting) => (
          <SettingItem setting={setting} key={setting.name} />
        ))}
      </List>
    </Stack>
  );
}
