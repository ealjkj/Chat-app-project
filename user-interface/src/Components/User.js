import { Stack, Box } from "@mui/material";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function User() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const messages = useSelector((state) => state.messages);
  const hasFriends = user?.friends.length;
  // const hasFriends = useSelector((state) => state.user?.friends.length);
  const userId = useSelector((state) => state.user?._id);
  const conversations = useSelector((state) => state.conversations);

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <Stack sx={{ height: "100vh" }}>
        <Header />
        <Outlet />
      </Stack>
    </>
  );
}
