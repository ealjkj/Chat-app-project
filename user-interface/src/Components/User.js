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
import { addMessage } from "../slices/messages.slice";

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

const ADDED_TO_CONVERSATION = gql`
  subscription {
    addedToConversation {
      _id
    }
  }
`;

const REMOVED_FROM_CONVERSATION = gql`
  subscription {
    removedFromConversation
  }
`;

const MESSAGES_SUBSCRIPTION = gql`
  subscription messageCreated {
    messageCreated {
      _id
      from
      text
      conversationId
      authorName
      createdAt
    }
  }
`;

export default function User() {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.user?._id);
  const search = useSelector((state) => state.searcher);
  const currentConversationId = useSelector(
    (state) => state.currentConversation
  );

  useSubscription(FRIEND_REQUEST_RECEIVED, {
    onData: (args) => {
      const sourceUser = args.data.data.friendRequestSent;
      dispatch(changeFriendRequestReceived({ sourceUser }));
      dispatch({
        type: "QUERY_FRIEND_REQUESTS",
      });
      dispatch({
        type: "DISCOVER_USERS",
        payload: { search },
      });
    },
  });

  useSubscription(FRIEND_REQUEST_ACCEPTED, {
    onData: (args) => {
      const targetUser = args.data.data.friendRequestAccepted;
      dispatch(changeFriendRequestAccepted({ targetUser }));
      dispatch({
        type: "QUERY_FRIEND_REQUESTS",
      });
      dispatch({ type: "QUERY_FRIENDS" });
      dispatch({
        type: "QUERY_CONVERSATIONS",
      });
    },
  });

  useSubscription(ADDED_TO_CONVERSATION, {
    onData: () => {
      dispatch({
        type: "QUERY_CONVERSATIONS",
      });
    },
  });

  useSubscription(REMOVED_FROM_CONVERSATION, {
    onData: () => {
      dispatch({
        type: "QUERY_CONVERSATIONS",
      });
    },
  });

  useSubscription(FRIEND_REMOVED, {
    onData: () => {
      dispatch({ type: "QUERY_FRIENDS" });
      dispatch({ type: "QUERY_CONVERSATIONS" });
    },
  });

  useSubscription(MESSAGES_SUBSCRIPTION, {
    onData: (args) => {
      const data = args.data.data;
      const message = {
        ...data.messageCreated,
        content: data.messageCreated.text,
      };
      dispatch({ type: "QUERY_CONVERSATIONS" });
      if (currentConversationId === message.conversationId)
        dispatch(addMessage({ message }));
    },
  });

  if (!userId) {
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
