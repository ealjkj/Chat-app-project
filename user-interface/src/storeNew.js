import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import rootSaga from "./sagas";

// reducers:
import alert from "./slices/alert.slice";
import conversations from "./slices/conversations.slice";
import currentConversation from "./slices/currentConversation.slice";
import detailsModalOpen from "./slices/detailsModalOpen.slice";
import discoveredUsers from "./slices/discoveredUsers.slice";
import existence from "./slices/existence.slice";
import extraParticipantsModalOpen from "./slices/extraParticipantsModalOpen.slice";
import friendRequestReceived from "./slices/friendRequestReceived.slice";
import friends from "./slices/friends.slice";
import language from "./slices/language.slice";
import loading from "./slices/loading.slice";
import logged from "./slices/logged.slice";
import messages from "./slices/messages.slice";
import modalOpen from "./slices/modalOpen.slice";
import modalSearcher from "./slices/modalSearcher.slice";
import notification from "./slices/notification.slice";
import participantsToAdd from "./slices/participantsToAdd.slice";
import searcher from "./slices/searcher.slice";
import signed from "./slices/signed.slice";
import user from "./slices/user.slice";

const sagaMiddleware = createSagaMiddleware();
const store = configureStore({
  reducer: {
    alert,
    conversations,
    currentConversation,
    detailsModalOpen,
    discoveredUsers,
    existence,
    extraParticipantsModalOpen,
    friendRequestReceived,
    friends,
    language,
    loading,
    logged,
    messages,
    modalOpen,
    modalSearcher,
    notification,
    participantsToAdd,
    searcher,
    signed,
    user,
  },
  middleware: (getDefaultMiddleware) => [
    ...getDefaultMiddleware({ thunk: false }),
    sagaMiddleware,
  ],
});

sagaMiddleware.run(rootSaga);

export default store;
