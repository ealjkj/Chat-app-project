import { Stack } from "@mui/material";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { gql } from "@apollo/client";
import { useSubscription } from "@apollo/client";
import Notifications from "./Notifications";

const FRIEND_REQUEST_RECEIVED = gql`
  subscription {
    friendRequestSent {
      _id
      username
      firstName
      lastName
    }
  }
`;

export default function User() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  useSubscription(FRIEND_REQUEST_RECEIVED, {
    onData: (args) => {
      const sourceUser = args.data.data.friendRequestSent;
      dispatch({
        type: "CHANGE_FRIEND_REQUEST_RECEIVED",
        payload: { sourceUser },
      });
      dispatch({ type: "QUERY_FRIEND_REQUESTS" });
    },
  });

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <Notifications />
      <Stack sx={{ height: "100vh" }}>
        <Header />
        <Outlet />
      </Stack>
    </>
  );
}
