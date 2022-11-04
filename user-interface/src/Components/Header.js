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

const Header = () => {
  const avatarUrl = useSelector((state) => state.user?.avatar || "");
  const pages = [
    { title: "Dashboard", link: "/user/dashboard" },
    { title: "Conversations", link: "/user/conversation/1" },
    { title: "Contacts", link: "/user/contacts" },
  ];

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

            <Tooltip title="Settings">
              <IconButton>
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
