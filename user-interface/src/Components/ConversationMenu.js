import { Menu, MenuItem, ListItemIcon } from "@mui/material";
import { useTranslation } from "react-i18next";

import GroupAddIcon from "@mui/icons-material/GroupAdd";
import { useDispatch } from "react-redux";
import { openModal } from "../slices/modalOpen.slice";

export default function ConversationMenu({ anchorEl, onClose }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const createNewConversation = () => {
    dispatch(openModal());
  };

  return (
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
      onClose={onClose}
      onClick={onClose}
    >
      <MenuItem onClick={createNewConversation}>
        <ListItemIcon>
          <GroupAddIcon />
        </ListItemIcon>
        {t("newConversation")}
      </MenuItem>
    </Menu>
  );
}
