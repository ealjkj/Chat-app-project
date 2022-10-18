import {
  Stack,
  Avatar,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";

const UserInfo = ({ user }) => {
  return (
    <Stack
      spacing={1}
      sx={{
        paddingLeft: 10,
        paddingRight: 10,
      }}
      justifyContent="center"
    >
      <Avatar
        sx={{ width: 200, height: 200, alignSelf: "center" }}
        src={user.avatar}
      ></Avatar>
      <Stack sx={{ alignSelf: "center" }} alignItems="center">
        <Typography sx={{ fontWeight: 600 }} variant="subtitle1">
          {user.firstName + " " + user.lastName}
        </Typography>
        <Typography>@{user.username}</Typography>
      </Stack>
      <Typography sx={{ paddingTop: 1 }} variant="body2">
        {user.description}
      </Typography>
      <Divider />

      <Typography variant="h6" sx={{ alignSelf: "center" }}>
        Information
      </Typography>

      <List>
        <ListItem>
          <ListItemIcon>
            <EmailIcon />
          </ListItemIcon>
          <ListItemText primary={user.email} />
        </ListItem>
      </List>
    </Stack>
  );
};

export default UserInfo;
