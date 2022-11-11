import { Menu, MenuItem, ListItemIcon } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Settings, Logout } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export default function DropdownMenu({ anchorEl, onClose }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const openSettings = () => {
    navigate("/user/settings");
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
    >
      <MenuItem onClick={openSettings}>
        <ListItemIcon>
          <Settings />
        </ListItemIcon>
        {t("settings")}
      </MenuItem>
      <MenuItem>
        <ListItemIcon>
          <Logout />
        </ListItemIcon>
        {t("logout")}
      </MenuItem>
    </Menu>
  );
}
