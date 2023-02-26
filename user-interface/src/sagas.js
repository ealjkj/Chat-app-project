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
import { defaultErrorAlert, resetState } from "./actions";
import i18next from "i18next";
import store from "./storeNew";

// Actions
import { changeUser, editUser } from "./slices/user.slice";
import { changeLanguage } from "./slices/language.slice";
import { changeAlert } from "./slices/alert.slice";
import { changeSigned } from "./slices/signed.slice";
import { changeFriends } from "./slices/friends.slice";
import {
  changeConversations,
  addConversation,
  removeParticipant as removeParticipantConv,
} from "./slices/conversations.slice";
import { changeMessages } from "./slices/messages.slice";
import { removeFriendRequest } from "./slices/user.slice";
import { changeDiscoveredUsers } from "./slices/discoveredUsers.slice";
import { removeParticipant } from "./slices/participantsToAdd.slice";
import { changeMessages as changeMessagesCurrentConversation } from "./slices/currentConversation.slice";
import { changeLoading } from "./slices/loading.slice";
import { editExistence } from "./slices/existence.slice";
import { changeLogged } from "./slices/logged.slice";

export function* login(action) {
  const options = {
    mutation: gql`
      mutation ($userInput: AuthInput) {
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

    yield put(changeUser({ user }));
    yield put(changeLogged({ logged: true }));

    yield put(
      changeLanguage({ language: user?.settings?.language || i18next.language })
    );

    yield put(changeAlert({ message: null }));
  } catch (error) {
    yield put(changeAlert({ severity: "error", message: error.message }));
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
    yield put(
      changeAlert({
        severity: "success",
        message: "Your account was successfully created",
      })
    );
    yield put(changeSigned({ value: true }));
  } catch (error) {
    yield put(changeAlert({ severity: "error", message: error.message }));
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
    yield put(resetState());
    yield call(client.resetStore);
    yield put(
      changeAlert({
        severity: "info",
        message: "You logged out",
      })
    );
  } catch (error) {
    yield put(
      changeAlert({
        severity: "error",
        message: "Unable to logout, if needed eliminate the cookies",
      })
    );
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
  const fetchPolicy = action?.payload?.fetchPolicy || "network-only";
  const options = {
    query: gql`
      query {
        friends {
          _id
          username
          firstName
          lastName
          avatar
        }
      }
    `,
    fetchPolicy,
  };

  const res = yield call(client.query, options);
  const friends = res.data.friends;
  yield put(changeFriends({ friends }));
  yield put({
    type: "DISCOVER_USERS",
    payload: { search: store.getState().searcher },
  });
}

export function* watchQueryMoreFriends() {
  yield takeLatest("QUERY_FRIENDS", queryMoreFriends);
}

export function* queryMoreConversations(action) {
  const fetchPolicy = action?.payload?.fetchPolicy || "network-only";
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
    fetchPolicy,
  };

  const res = yield call(client.query, options);
  const conversations = res.data.conversations.map((conversation) => ({
    ...conversation,
    lastMessage: {
      ...conversation.lastMessage,
      content: conversation.lastMessage.text,
    },
  }));

  yield put(changeConversations({ conversations }));
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
    fetchPolicy: "network-only",
  };

  const res = yield call(client.query, messageOptions);
  const messages = res.data.messages.map((message) => ({
    ...message,
    content: message.text,
  }));

  yield put(
    changeMessages({ messages, conversationId: action.payload.conversationId })
  );
  yield put(
    changeMessagesCurrentConversation({
      messages,
      conversationId: action.payload.conversationId,
    })
  );
}

export function* watchChangeConversation() {
  yield takeLatest("CHANGE_CONVERSATION", changeConversation);
}

// -----------------------------------------
export function* sendFriendRequest(action) {
  const options = {
    mutation: gql`
      mutation ($friendId: ID) {
        sendFriendRequest(friendId: $friendId)
      }
    `,
    variables: {
      friendId: action.payload.user._id,
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
  yield all([
    put({ type: "QUERY_FRIENDS" }),
    put({ type: "QUERY_FRIEND_REQUESTS" }),
    put({ type: "QUERY_CONVERSATIONS" }),
  ]);
}

export function* watchAcceptFriend() {
  yield takeEvery("ACCEPT_FRIEND", acceptFriend);
}
// -----------------------------------------
export function* rejectFriend(action) {
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
  yield put(removeFriendRequest({ friend: action.payload.friend }));
}

export function* watchRejectFriend() {
  yield takeEvery("REJECT_FRIEND", rejectFriend);
}

//-----------------------------------------------
export function* discoverUsers(action) {
  if (action.payload.search === "") return;

  const options = {
    query: gql`
      query ($search: String) {
        discoveredUsers(search: $search) {
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
    },
    fetchPolicy: "network-only",
  };
  const res = yield call(client.query, options);
  const discoveredUsers = res.data.discoveredUsers;
  yield put(changeDiscoveredUsers({ discoveredUsers }));
}

export function* watchDiscoverUsers() {
  yield takeLatest("DISCOVER_USERS", discoverUsers);
}

// -----------------------------------------
export function* leaveConversation(action) {
  const options = {
    mutation: gql`
      mutation ($conversationId: ID) {
        leaveConversation(conversationId: $conversationId)
      }
    `,
    variables: {
      conversationId: action.payload.conversationId,
    },
  };
  yield call(client.mutate, options);
  yield put({ type: "QUERY_CONVERSATIONS" });
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
  const conversation = {
    ...res.data.createConversation,
    lastMessage: {
      ...res.data.createConversation.lastMessage,
      content: res.data.createConversation.lastMessage.text,
    },
  };
  yield put(addConversation({ conversation }));
}

export function* watchQueryCreateConversation() {
  yield takeEvery("CREATE_CONVERSATION", queryCreateConversation);
}

// -----------------------------------------
export function* queryRemoveParticipant(action) {
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
  yield put(
    removeParticipant({
      conversationId: action.payload.conversationId,
      participantId: action.payload.participantId,
    })
  );
  yield put(
    removeParticipantConv({
      conversationId: action.payload.conversationId,
      participantId: action.payload.participantId,
    })
  );
}

export function* watchQueryRemoveParticipant() {
  yield takeEvery("QUERY_REMOVE_PARTICIPANT", queryRemoveParticipant);
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
  yield put(changeLanguage({ language: action.payload.language }));
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
    yield put(changeUser({ user }));
    yield put(changeLogged({ logged: true }));
    const language = user?.settings?.language || i18next.language;
    yield put(changeLanguage({ language }));
    yield call(i18next.changeLanguage, language);
  } catch (error) {
    if (error.message !== "NO_TOKEN") {
      console.error(error);
      yield put(defaultErrorAlert());
    }
  }
  yield put(changeLoading({ value: false }));
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
    yield put(editExistence({ username }));
  } catch (error) {
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
    yield put(editExistence({ email }));
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
    yield put(changeLanguage({ language }));
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
  const fetchPolicy = action?.payload?.fetchPolicy || "network-only";
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
    fetchPolicy,
  };
  try {
    const res = yield call(client.query, options);
    const user = res.data.user;
    yield put(editUser({ user }));
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
    yield all([
      put({ type: "QUERY_FRIENDS" }),
      put({ type: "QUERY_CONVERSATIONS" }),
    ]);
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
    watchQueryRemoveParticipant(),
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
