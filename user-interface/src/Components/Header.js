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
  LinkProps,
} from "@mui/material";
import {
  Link as RouterLink,
  LinkProps as RouterLinkProps,
} from "react-router-dom";
import { forwardRef } from "react";

const LinkBehavior = forwardRef((props, ref) => {
  const { href, ...other } = props;
  return <RouterLink ref={ref} to={href} {...other} />;
});

const Header = () => {
  const pages = ["Home", "Contacts", "Dashboard"];

  return (
    <Box>
      <AppBar position="static" sx={{ height: 200 }}>
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
                    sx={{ marginLeft: "1rem" }}
                    key={page}
                  >
                    {page}
                  </Button>
                );
              })}
            </Box>

            <Tooltip title="Settings">
              <IconButton>
                <Avatar src="/avatars/jorge.jpg" />
              </IconButton>
            </Tooltip>
          </Toolbar>
        </Container>
      </AppBar>
    </Box>
  );
};

export default Header;
