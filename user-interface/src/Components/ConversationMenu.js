import { Menu, MenuItem, ListItemIcon, Modal } from "@mui/material";
import { useTranslation } from "react-i18next";

import CreateConversationModal from "./CreateConversationModal";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import { useDispatch, useSelector } from "react-redux";

export default function ConversationMenu({ anchorEl, onClose }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const createNewConversation = () => {
    dispatch({ type: "OPEN_MODAL" });
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
        {t("New Conversation")}
      </MenuItem>
    </Menu>
  );
}
