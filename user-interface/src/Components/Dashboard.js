import { Grid } from "@mui/material";
import UserInfo from "./UserInfo";
import FriendsList from "./FriendsList";
import { useState, useEffect } from "react";

const emptyUser = {
  username: "ealjkj",
  firstName: "",
  lastName: "",
  email: "",
  avatar: "",
  description: "",
  friends: [],
};

const Dashboard = () => {
  const [user, setUser] = useState(emptyUser);

  useEffect(() => {
    fetch("../profile.json")
      .then((response) => response.json())
      .then((data) => {
        return setUser(data);
      });
  }, []);

  return (
    <Grid container spacing={2} sx={{ paddingTop: 4 }}>
      <Grid item xs={12} md={7}>
        <UserInfo user={user}></UserInfo>
      </Grid>
      <Grid item xs={12} md={5}>
        <FriendsList friends={user.friends}></FriendsList>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
