import { Grid, Paper, Stack } from "@mui/material";
import FriendsList from "./FriendsList";
import FriendRequestsList from "./FriendRequestsList";
import ConnectList from "./ConnectList";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { changeSearch } from "../slices/searcher.slice";

const Contacts = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(changeSearch({ value: "" }));
  }, []);

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
