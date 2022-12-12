import { Grid, Paper, Stack, Box, Typography } from "@mui/material";
import FriendsList from "./FriendsList";
import FriendRequestsList from "./FriendRequestsList";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import ConnectList from "./ConnectList";

const Contacts = () => {
  const { t } = useTranslation();
  const user = useSelector((state) => state.user);

  return (
    <Grid container spacing={2} sx={{ flexGrow: 1 }}>
      <Grid item xs={12} md={5}>
        <Stack sx={{ height: "100%" }}>
          <Paper sx={{ height: "50%", margin: 1 }} elevation={4}>
            <FriendsList maxHeight="35vh"></FriendsList>
          </Paper>
          <Paper sx={{ height: "50%", margin: 1 }} elevation={4}>
            <FriendRequestsList maxHeight="35vh"></FriendRequestsList>
          </Paper>
        </Stack>
      </Grid>
      <Grid item md={7} xs={12}>
        <Stack sx={{ height: "100%" }}>
          <Paper sx={{ height: "100%", margin: 1 }} elevation={4}>
            <ConnectList maxHeight="70vh" />
          </Paper>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default Contacts;
