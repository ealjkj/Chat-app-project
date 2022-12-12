import { Box, Paper, InputBase, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";
import ConversationMenu from "./ConversationMenu";

export default function SearchBar({
  height,
  label,
  menu,
  onChange,
  value,
  onSubmit,
}) {
  const [anchorEl, setAnchorEl] = useState(null);

  const defaultSearch = (event) => {
    event.preventDefault();
  };

  const handleSearch = onSubmit || defaultSearch;

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Box
        sx={{
          width: "100%",
          height: `${height}px`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
        }}
      >
        <Paper
          component="form"
          onSubmit={handleSearch}
          sx={{
            padding: "0 10px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <ConversationMenu anchorEl={anchorEl} onClose={handleClose} />

          {menu ? (
            <IconButton onClick={handleMenu}>
              <MenuIcon />
            </IconButton>
          ) : null}
          <InputBase
            placeholder={label}
            onChange={onChange}
            value={value}
          ></InputBase>
          <IconButton type="submit" sx={{ justifySelf: "flex-end" }}>
            <SearchIcon />
          </IconButton>
        </Paper>
      </Box>
    </>
  );
}
