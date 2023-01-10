import { gql } from "@apollo/client";
import {
  put,
  takeEvery,
  all,
  call,
  takeLatest,
  throttle,
} from "redux-saga/effects";
import client from "./client";
import { defaultErrorAlert } from "./actions";
import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { getI18nParams } from "./i18n";

// Actions

export function* login(action) {
  const options = {
    mutation: gql`
      mutation ($userInput: UserInput) {
        login(userInput: $userInput) {
          _id
          username
          firstName
          lastName
          email
          friends
          conversations
          settings {
            language
          }
          avatar
          friendRequests {
            _id
            username
            firstName
            lastName
            email
          }
        }
      }
    `,
    variables: {
      userInput: action.payload.user,
    },
  };

  try {
    const res = yield call(client.mutate, options);
    const user = res.data.login;

    yield put({ type: "CHANGE_USER", payload: { user } });

    yield put({
      type: "CHANGE_LANGUAGE",
      payload: { language: user?.settings?.language || i18next.language },
    });

    yield put({ type: "CHANGE_ALERT", payload: { message: null } });
  } catch (error) {
    yield put({
      type: "CHANGE_ALERT",
      payload: { severity: "error", message: error.message },
    });
  }
}

export function* watchLogin() {
  yield takeEvery("LOG_IN", login);
}

// -----------------------------------------------

export function* signup(action) {
  const options = {
    mutation: gql`
      mutation ($userInput: UserInput) {
        createUser(userInput: $userInput) {
          success
          errorMessage
        }
      }
    `,
    variables: {
      userInput: action.payload.userInput,
    },
  };

  try {
    yield call(client.mutate, options);
    yield put({
      type: "CHANGE_ALERT",
      payload: {
        severity: "success",
        message: "Your account was successfully created",
      },
    });
    yield put({ type: "CHANGE_SIGNED", payload: { value: true } });
  } catch (error) {
    console.error(error);
    yield put({
      type: "CHANGE_ALERT",
      payload: { severity: "error", message: error.message },
    });
  }
}

export function* watchSignup() {
  yield takeEvery("SIGN_UP", signup);
}

// -----------------------------------------------

export function* logout(action) {
  const options = {
    mutation: gql`
      mutation {
        logout {
          success
        }
      }
    `,
  };

  try {
    yield call(client.mutate, options);
    yield put({
      type: "CHANGE_USER",
      payload: { user: null },
    });
    yield put({
      type: "CHANGE_ALERT",
      payload: {
        severity: "info",
        message: "You logged out",
      },
    });
  } catch (error) {
    yield put({
      type: "CHANGE_ALERT",
      payload: {
        severity: "error",
        message: "Unable to logout, if needed eliminate the cookies",
      },
    });
  }
}

export function* watchLogout() {
  yield takeEvery("LOG_OUT", logout);
}

//-----------------------------
export function* mutateCreateMessage(action) {
  const options = {
    mutation: gql`
      mutation ($messageInput: MessageInput) {
        createMessage(messageInput: $messageInput) {
          from
          text
        }
      }
    `,
    variables: {
      messageInput: action.payload.message,
    },
  };
  yield call(client.mutate, options);
}

export function* watchMutateCreateMessage() {
  yield takeEvery("MUTATE_CREATE_MESSAGE", mutateCreateMessage);
}

export function* queryMoreFriends(action) {
  const options = {
    query: gql`
      query ($userId: ID) {
        friends(userId: $userId) {
          _id
          username
          firstName
          lastName
          avatar
        }
      }
    `,
    variables: {
      userId: action.payload.userId,
    },
    fetchPolicy: "no-cache",
  };

  const res = yield call(client.query, options);
  const friends = res.data.friends;
  yield put({ type: "CHANGE_FRIENDS", payload: { friends } });
}

export function* watchQueryMoreFriends() {
  yield takeLatest("QUERY_FRIENDS", queryMoreFriends);
}

export function* queryMoreConversations(action) {
  const options = {
    query: gql`
      query {
        conversations {
          _id
          title
          joinedAt
          avatars
          lastMessage {
            from
            text
            createdAt
          }
          members {
            _id
            username
            firstName
            lastName
            avatar
          }
          isOneOnOne
          admins
        }
      }
    `,
    fetchPolicy: "no-cache",
  };

  const res = yield call(client.query, options);
  const conversations = res.data.conversations.map((conversation) => ({
    ...conversation,
    lastMessage: {
      ...conversation.lastMessage,
      content: conversation.lastMessage.text,
    },
  }));
  yield put({ type: "CHANGE_CONVERSATIONS", payload: { conversations } });
}

export function* watchQueryMoreConversations() {
  yield throttle(500, "QUERY_CONVERSATIONS", queryMoreConversations);
}

export function* changeConversation(action) {
  const messageOptions = {
    query: gql`
      query ($conversationId: ID) {
        messages(conversationId: $conversationId) {
          _id
          from
          text
          conversationId
          authorName
          createdAt
        }
      }
    `,
    variables: {
      conversationId: action.payload.conversationId,
    },
    fetchPolicy: "no-cache",
  };

  const res = yield call(client.query, messageOptions);
  const messages = res.data.messages.map((message) => ({
    ...message,
    content: message.text,
  }));

  yield put({
    type: "CHANGE_MESSAGES",
    payload: { messages, conversationId: action.payload.conversationId },
  });
}

export function* watchChangeConversation() {
  yield takeLatest("CHANGE_CONVERSATION", changeConversation);
}

// -----------------------------------------
export function* sendFriendRequest(action) {
  const options = {
    mutation: gql`
      mutation ($friendshipInput: FriendshipInput) {
        sendFriendRequest(friendshipInput: $friendshipInput)
      }
    `,
    variables: {
      friendshipInput: {
        myId: action.payload.myId,
        friendId: action.payload.user._id,
      },
    },
  };

  yield call(client.mutate, options);
}

export function* watchSendFriendRequest() {
  yield takeEvery("SEND_FRIEND_REQUEST", sendFriendRequest);
}

// -----------------------------------------
export function* acceptFriend(action) {
  const options = {
    mutation: gql`
      mutation ($friendId: ID) {
        acceptFriend(friendId: $friendId)
      }
    `,
    variables: {
      friendId: action.payload.friend._id,
    },
  };
  yield call(client.mutate, options);
  yield put({
    type: "ADD_FRIEND",
    payload: { friend: action.payload.friend },
  });
}

export function* watchAcceptFriend() {
  yield takeEvery("ACCEPT_FRIEND", acceptFriend);
}
// -----------------------------------------
export function* rejectFriend(action) {
  console.log(action);
  const options = {
    mutation: gql`
      mutation ($friendId: ID) {
        rejectFriend(friendId: $friendId)
      }
    `,
    variables: {
      friendId: action.payload.friend._id,
    },
  };
  yield call(client.mutate, options);
  yield put({
    type: "REMOVE_FRIEND_REQUEST",
    payload: { friend: action.payload.friend },
  });
}

export function* watchRejectFriend() {
  yield takeEvery("REJECT_FRIEND", rejectFriend);
}

//-----------------------------------------------
export function* discoverUsers(action) {
  const options = {
    query: gql`
      query ($search: String, $myId: ID) {
        discoveredUsers(search: $search, myId: $myId) {
          _id
          username
          firstName
          lastName
          avatar
          email
          requestSent
        }
      }
    `,
    variables: {
      search: action.payload.search,
      myId: action.payload.myId,
    },
    fetchPolicy: "no-cache",
  };
  const res = yield call(client.query, options);
  const discoveredUsers = res.data.discoveredUsers;
  yield put({ type: "CHANGE_DISCOVERED_USERS", payload: { discoveredUsers } });
}

export function* watchDiscoverUsers() {
  yield takeLatest("DISCOVER_USERS", discoverUsers);
}

// -----------------------------------------
export function* leaveConversation(action) {
  const options = {
    mutation: gql`
      mutation ($myId: ID, $conversationId: ID) {
        leaveConversation(myId: $myId, conversationId: $conversationId)
      }
    `,
    variables: {
      friendshipInput: {
        myId: action.payload.myId,
        conversationId: action.payload.conversationId,
      },
    },
  };
  yield call(client.mutate, options);
  yield put({
    type: "REMOVE_CONVERSATION",
    payload: { conversationId: action.payload.conversationId },
  });
}

export function* watchLeaveConversation() {
  yield takeEvery("LEAVE_CONVERSATION", leaveConversation);
}

// -----------------------------------------
export function* queryCreateConversation(action) {
  const options = {
    mutation: gql`
      mutation ($conversationInput: ConversationInput) {
        createConversation(conversationInput: $conversationInput) {
          _id
          title
          avatars
          lastMessage {
            from
            text
            createdAt
          }
          isOneOnOne
          admins
          members {
            _id
            username
            firstName
            lastName
            avatar
          }
        }
      }
    `,
    variables: {
      conversationInput: action.payload.conversationInput,
    },
  };
  const res = yield call(client.mutate, options);
  console.log(res.data.createConversation);
  const conversation = {
    ...res.data.createConversation,
    lastMessage: {
      ...res.data.createConversation.lastMessage,
      content: res.data.createConversation.lastMessage.text,
    },
  };
  yield put({
    type: "ADD_CONVERSATION",
    payload: { conversation },
  });
}

export function* watchQueryCreateConversation() {
  yield takeEvery("CREATE_CONVERSATION", queryCreateConversation);
}

// -----------------------------------------
export function* removeParticipant(action) {
  const options = {
    mutation: gql`
      mutation ($conversationId: ID, $participantId: ID) {
        removeParticipant(
          conversationId: $conversationId
          participantId: $participantId
        )
      }
    `,
    variables: {
      ...action.payload,
    },
  };

  yield call(client.mutate, options);
  yield put({
    type: "REMOVE_PARTICIPANT",
    payload: {
      conversationId: action.payload.conversationId,
      participantId: action.payload.participantId,
    },
  });
}

export function* watchRemoveParticipant() {
  yield takeEvery("QUERY_REMOVE_PARTICIPANT", removeParticipant);
}

// -----------------------------------------
// -----------------------------------------
export function* addParticipants(action) {
  const options = {
    mutation: gql`
      mutation ($conversationId: ID, $participants: [ID]) {
        addParticipants(
          conversationId: $conversationId
          participants: $participants
        )
      }
    `,
    variables: {
      ...action.payload,
    },
  };

  yield call(client.mutate, options);
  yield put({
    type: "QUERY_CONVERSATIONS",
  });
}

export function* watchAddParticipants() {
  yield takeEvery("QUERY_ADD_PARTICIPANTS", addParticipants);
}

// -----------------------------------------
export function* queryChangeLanguage(action) {
  const options = {
    mutation: gql`
      mutation ($myId: ID, $language: String) {
        changeLanguage(myId: $myId, language: $language)
      }
    `,
    variables: {
      ...action.payload,
    },
  };

  yield call(client.mutate, options);
  yield put({
    type: "CHANGE_LANGUAGE",
    payload: { language: action.payload.language },
  });
}

export function* watchQueryChangeLanguage() {
  yield takeEvery("QUERY_CHANGE_LANGUAGE", queryChangeLanguage);
}

//-----------------------------------------------
export function* queryUser(action) {
  const options = {
    query: gql`
      query {
        user {
          _id
          username
          firstName
          lastName
          email
          friends
          conversations
          token
          avatar
          settings {
            language
          }
          friendRequests {
            _id
            username
            firstName
            lastName
            email
          }
        }
      }
    `,
  };
  try {
    const res = yield call(client.query, options);
    const user = res.data.user;
    yield put({ type: "CHANGE_USER", payload: { user } });
    const language = user?.settings?.language || i18next.language;
    yield put({
      type: "CHANGE_LANGUAGE",
      payload: { language },
    });
    yield call(i18next.changeLanguage, language);
  } catch (error) {
    if (error.message !== "NO_TOKEN") {
      console.error(error);
      yield put(defaultErrorAlert());
    }
  }
  yield put({ type: "CHANGE_LOADING", payload: { value: false } });
}

export function* watchQueryUser() {
  yield takeLatest("QUERY_USER", queryUser);
}

//-----------------------------------------------
export function* queryUserExistence(action) {
  const options = {
    query: gql`
      query ($username: String) {
        exists(username: $username) {
          username
        }
      }
    `,
    variables: action.payload,
  };
  try {
    const res = yield call(client.query, options);
    const { username } = res.data.exists;
    yield put({ type: "EDIT_EXISTENCE", payload: { username } });
  } catch (error) {
    console.error(error);
    yield put(defaultErrorAlert());
  }
}

export function* watchQueryUserExistence() {
  yield throttle(500, "QUERY_USER_EXISTENCE", queryUserExistence);
}

//-----------------------------------------------

export function* queryEmailExistence(action) {
  const options = {
    query: gql`
      query ($email: String) {
        exists(email: $email) {
          email
        }
      }
    `,
    variables: action.payload,
  };
  try {
    const res = yield call(client.query, options);
    const { email } = res.data.exists;
    yield put({ type: "EDIT_EXISTENCE", payload: { email } });
  } catch (error) {
    yield put(defaultErrorAlert());
  }
}
export function* watchQueryEmailExistence() {
  yield throttle(500, "QUERY_EMAIL_EXISTENCE", queryEmailExistence);
}
//-----------------------------------------------
export function* saveLanguage(action) {
  const { language } = action.payload;
  const options = {
    mutation: gql`
      mutation ($language: String) {
        changeLanguage(language: $language)
      }
    `,
    variables: {
      language,
    },
  };
  try {
    yield call(client.mutate, options);
    yield put({
      type: "CHANGE_LANGUAGE",
      payload: { language },
    });
  } catch (error) {
    yield put(defaultErrorAlert());
  }
}
export function* watchSaveLanguage() {
  yield takeLatest("SAVE_LANGUAGE", saveLanguage);
}
// ---------------
//-----------------------------------------------
export function* queryFriendRequests(action) {
  const options = {
    query: gql`
      query {
        user {
          friendRequests {
            _id
            username
            firstName
            lastName
            email
          }
        }
      }
    `,
    fetchPolicy: "no-cache",
  };
  try {
    const res = yield call(client.query, options);
    const user = res.data.user;
    yield put({ type: "EDIT_USER", payload: { user } });
  } catch (error) {
    yield put(defaultErrorAlert());
  }
}

export function* watchQueryFriendRequests() {
  yield takeLatest("QUERY_FRIEND_REQUESTS", queryFriendRequests);
}

//-----------------------------------------------
export function* queryUnfriend(action) {
  const { friendId } = action.payload;
  const options = {
    mutation: gql`
      mutation ($friendId: ID) {
        unfriend(friendId: $friendId)
      }
    `,
    variables: {
      friendId,
    },
  };
  try {
    yield call(client.mutate, options);
    yield put({ type: "REMOVE_FRIEND", payload: { friendId } });
  } catch (error) {
    yield put(defaultErrorAlert());
  }
}
export function* watchQueryUnfriend() {
  yield takeLatest("QUERY_UNFRIEND", queryUnfriend);
}
// ---------------
//-----------------------------------------------

export default function* rootSaga() {
  yield all([
    watchQueryUser(),
    watchQueryMoreFriends(),
    watchQueryMoreConversations(),
    watchMutateCreateMessage(),
    watchChangeConversation(),
    watchSendFriendRequest(),
    watchAcceptFriend(),
    watchRejectFriend(),
    watchDiscoverUsers(),
    watchLeaveConversation(),
    watchQueryCreateConversation(),
    watchRemoveParticipant(),
    watchAddParticipants(),
    watchQueryChangeLanguage(),
    watchQueryFriendRequests(),
    watchSignup(),
    watchLogout(),
    watchLogin(),
    watchQueryUserExistence(),
    watchQueryEmailExistence(),
    watchSaveLanguage(),
    watchQueryUnfriend(),
  ]);
}
