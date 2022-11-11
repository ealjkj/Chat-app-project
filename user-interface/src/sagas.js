import { gql } from "@apollo/client";
import { put, takeEvery, all, call, takeLatest } from "redux-saga/effects";
import client from "./client";
export function* queryUser(action) {
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
          token
          avatar
        }
      }
    `,
    variables: {
      userInput: action.payload.user,
    },
  };

  const res = yield call(client.mutate, options);
  const user = res.data.login;
  yield put({ type: "CHANGE_USER", payload: { user } });
}

export function* watchQueryUser() {
  yield takeEvery("QUERY_USER", queryUser);
}

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
  };

  const res = yield call(client.query, options);
  const friends = res.data.friends;
  yield put({ type: "ADD_FRIENDS", payload: { friends } });
}

export function* watchQueryMoreFriends() {
  yield takeLatest("QUERY_MORE_FRIENDS", queryMoreFriends);
}

export function* queryMoreConversations(action) {
  const options = {
    query: gql`
      query ($userId: ID) {
        conversations(userId: $userId) {
          _id
          title
          avatars
          message
          members {
            _id
          }
        }
      }
    `,
    variables: {
      userId: action.payload.userId,
    },
  };

  const res = yield call(client.query, options);
  const conversations = res.data.conversations;

  yield put({ type: "ADD_CONVERSATIONS", payload: { conversations } });
}

export function* watchQueryMoreConversations() {
  yield takeLatest("QUERY_MORE_CONVERSATIONS", queryMoreConversations);
}

export default function* rootSaga() {
  yield all([
    watchQueryUser(),
    watchQueryMoreFriends(),
    watchQueryMoreConversations(),
    watchMutateCreateMessage(),
  ]);
}
