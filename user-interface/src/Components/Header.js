import {
  AppBar,
  Button,
  Typography,
  Box,
  Toolbar,
  Container,
  Tooltip,
  IconButton,
  Avatar,
} from "@mui/material";
import { useSelector } from "react-redux";
import { Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import DropdownMenu from "./DropdownMenu";

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const avatarUrl = useSelector((state) => state.user?.avatar || "");
  const { t } = useTranslation();
  const currentConversation = useSelector((state) => state.currentConversation);

  const pages = [
    { title: t("dashboard"), link: "/user/dashboard" },
    {
      title: t("conversations"),
      link: `/user/conversation/${currentConversation}`,
    },
    { title: t("contacts"), link: "/user/contacts" },
  ];

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
      <AppBar position="static" sx={{ height: "64px" }}>
        <Container>
          <Toolbar>
            <Typography sx={{ marginLeft: 3 }} variant="h5">
              Js-Chat
            </Typography>
            <Box sx={{ marginLeft: "auto" }}>
              {pages.map((page) => {
                return (
                  <Button
                    variant="primary"
                    component={RouterLink}
                    sx={{ marginLeft: "1rem" }}
                    key={page.title}
                    to={page.link}
                  >
                    {page.title}
                  </Button>
                );
              })}
            </Box>
            <DropdownMenu anchorEl={anchorEl} onClose={handleClose} />
            <Tooltip title="Settings">
              <IconButton onClick={handleMenu}>
                <Avatar src={avatarUrl} />
              </IconButton>
            </Tooltip>
          </Toolbar>
        </Container>
      </AppBar>
    </Box>
  );
};

export default Header;
