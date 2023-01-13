import SearchBar from "./SearchBar";
import { Stack, List, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import ConnectItem from "./ConnectItem";
import { changeSearch } from "../slices/searcher.slice";

const ConnectList = ({ maxHeight = "80vh" }) => {
  const dispatch = useDispatch();
  const searcher = useSelector((state) => state.searcher);
  const userId = useSelector((state) => state.user._id);
  const discoveredUsers = useSelector((state) => state.discoveredUsers);
  const { t } = useTranslation();

  const handleChange = (event) => {
    dispatch(changeSearch({ value: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch({
      type: "DISCOVER_USERS",
      payload: { search: searcher, myId: userId },
    });
  };

  return (
    <Stack sx={{ height: "100%" }}>
      <Typography
        sx={{ textAlign: "center", padding: 1, fontWeight: 600 }}
        variant="h6"
      >
        {t("connect")}
      </Typography>
      <SearchBar
        onChange={handleChange}
        value={searcher}
        menu={false}
        onSubmit={handleSubmit}
      ></SearchBar>
      <List
        sx={{
          width: "100%",
          maxHeight,
          overflowY: "scroll",
        }}
      >
        {discoveredUsers.map((user) => (
          <ConnectItem user={user} key={user.username} />
        ))}
      </List>
    </Stack>
  );
};

export default ConnectList;
