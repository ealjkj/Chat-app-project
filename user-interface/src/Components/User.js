import { Stack } from "@mui/material";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { gql } from "@apollo/client";
import { useSubscription } from "@apollo/client";
import Notifications from "./Notifications";
import { changeFriendRequestReceived } from "../slices/friendRequestReceived.slice";
import { changeFriendRequestAccepted } from "../slices/friendRequestAccepted.slice";

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

const FRIEND_REQUEST_ACCEPTED = gql`
  subscription {
    friendRequestAccepted {
      _id
      username
      firstName
      lastName
    }
  }
`;

const FRIEND_REMOVED = gql`
  subscription {
    friendRemoved
  }
`;

export default function User() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const search = useSelector((state) => state.searcher);

  useSubscription(FRIEND_REQUEST_RECEIVED, {
    onData: (args) => {
      const sourceUser = args.data.data.friendRequestSent;
      dispatch(changeFriendRequestReceived({ sourceUser }));
      dispatch({ type: "QUERY_FRIEND_REQUESTS" });
    },
  });

  useSubscription(FRIEND_REQUEST_ACCEPTED, {
    onData: (args) => {
      const targetUser = args.data.data.friendRequestAccepted;
      dispatch(changeFriendRequestAccepted({ targetUser }));
      dispatch({ type: "QUERY_FRIEND_REQUESTS" });
      dispatch({ type: "QUERY_FRIENDS" });
      dispatch({ type: "QUERY_CONVERSATIONS" });
    },
  });

  useSubscription(FRIEND_REMOVED, {
    onData: () => {
      dispatch({ type: "QUERY_FRIENDS" });
      dispatch({ type: "QUERY_CONVERSATIONS" });
      dispatch({ type: "DISCOVER_USERS", payload: { search } });
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
