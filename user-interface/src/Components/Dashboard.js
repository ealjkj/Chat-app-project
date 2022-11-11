import { Grid } from "@mui/material";
import UserInfo from "./UserInfo";
import FriendsList from "./FriendsList";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const user = useSelector((state) => state.user);

  return (
    <Grid container spacing={2} sx={{ paddingTop: 4 }}>
      <Grid item xs={12} md={7}>
        <UserInfo user={user}></UserInfo>
      </Grid>
      <Grid item xs={12} md={5}>
        <FriendsList friends={user?.friends}></FriendsList>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
