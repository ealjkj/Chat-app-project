import { Stack } from "@mui/material";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import { useDispatch, useSelector } from "react-redux";

export default function User() {
  const dispatch = useDispatch();
  const hasFriends = useSelector((state) => state.user.friends.length);
  const userId = useSelector((state) => state.user._id);
  const conversations = useSelector((state) => state.conversations);

  useEffect(() => {
    if (hasFriends && conversations.length === 0) {
      dispatch({ type: "QUERY_MORE_CONVERSATIONS", payload: { userId } });
    }
  }, []);

  return (
    <>
      <Stack sx={{ height: "100vh" }}>
        <Header></Header>
        <Outlet />
      </Stack>
    </>
  );
}
