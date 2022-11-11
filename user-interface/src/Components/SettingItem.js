import {
  Box,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import { Link as RouterLink } from "react-router-dom";
export default function SettingItem({ setting }) {
  const Icon = setting.icon;

  return (
    <Box>
      <ListItem
        disablePadding
        component={RouterLink}
        to={`/user/settings/${setting.redirect}`}
      >
        <ListItemButton>
          <ListItemIcon>
            <Icon fontSize="large" />
          </ListItemIcon>
          <ListItemText
            primary={setting.name}
            secondary={setting?.description}
          />
        </ListItemButton>
      </ListItem>
    </Box>
  );
}
