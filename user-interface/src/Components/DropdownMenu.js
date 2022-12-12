import { Menu, MenuItem, ListItemIcon } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Settings, Logout } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

export default function DropdownMenu({ anchorEl, onClose }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const openSettings = () => {
    navigate("/user/settings");
  };

  const logout = () => {
    dispatch({ type: "LOG_OUT" });
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
      <MenuItem onClick={openSettings}>
        <ListItemIcon>
          <Settings />
        </ListItemIcon>
        {t("settings")}
      </MenuItem>
      <MenuItem onClick={logout}>
        <ListItemIcon color="error">
          <Logout />
        </ListItemIcon>
        {t("logout")}
      </MenuItem>
    </Menu>
  );
}
