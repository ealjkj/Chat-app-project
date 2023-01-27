import {
  Typography,
  Stack,
  Select,
  Box,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  Divider,
  Paper,
} from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

export default function LanguageSettings() {
  const language = useSelector((state) => state.language);
  const [languageOnSelect, setLanguageOnSelect] = useState(language);
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();

  const handleChange = (event) => {
    setLanguageOnSelect(event.target.value);
  };
  const handleLanguageChange = (event) => {
    event.preventDefault();
    i18n.changeLanguage(languageOnSelect);
    dispatch({
      type: "SAVE_LANGUAGE",
      payload: { language: languageOnSelect },
    });
  };
  return (
    <Box>
      <Paper
        elevation={4}
        component="form"
        onSubmit={handleLanguageChange}
        sx={{ padding: 5, margin: 8 }}
      >
        <Typography variant="h4" sx={{ textAlign: "right", marginRight: 2 }}>
          {t("languageSettings")}
        </Typography>
        <Stack
          direction="row"
          sx={{
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 2,
            marginTop: 2,
          }}
        >
          <Typography sx={{ marginRight: 5 }}>{t("selectLanguage")}</Typography>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel id="language-label">{t("language")}</InputLabel>
            <Select
              label={t("language")}
              labelId="language-label"
              value={languageOnSelect}
              onChange={handleChange}
            >
              <MenuItem value={"en"}>{"English"}</MenuItem>
              <MenuItem value={"es"}>{"Español"}</MenuItem>
              <MenuItem value={"fr"}>{"Français "}</MenuItem>
            </Select>
          </FormControl>
        </Stack>
        <Divider />
        <Button
          variant="contained"
          type="submit"
          sx={{ marginTop: 2, alignSelf: "flex-end" }}
        >
          {t("applyChanges")}
        </Button>
      </Paper>
    </Box>
  );
}
