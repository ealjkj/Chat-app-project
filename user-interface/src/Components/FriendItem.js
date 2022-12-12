import {
  Box,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  IconButton,
  Divider,
  Menu,
  MenuItem,
  ListItemIcon,
} from "@mui/material";
import { useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
// import ChatIcon from "@mui/icons-material/Chat";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

const FriendItem = ({ friend }) => {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);
  const dispatch = useDispatch();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleUnfriend = () => {
    dispatch({ type: "QUERY_UNFRIEND", payload: { friendId: friend._id } });
  };

  return (
    <Box>
      <ListItem>
        <ListItemAvatar>
          <Avatar src={friend.avatar} />
        </ListItemAvatar>

        <ListItemText
          primary={friend.firstName + " " + friend.lastName}
          secondary={friend.username}
        />
        <IconButton onClick={handleMenu}>
          <MoreVertIcon />
        </IconButton>
      </ListItem>
      <Divider />

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        onClose={handleClose}
        onClick={handleClose}
      >
        <MenuItem onClick={handleUnfriend}>
          <ListItemIcon>
            <PersonRemoveIcon />
          </ListItemIcon>
          {t("unfriend")}
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default FriendItem;
