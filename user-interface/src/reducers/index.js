import { combineReducers } from "redux";

import messages from "./messages.reducer";
import user from "./user.reducer";
import conversations from "./conversations.reducer";
import friends from "./friends.reducer";
import language from "./language.reducer";
import currentConversation from "./currentConversation.reducer";
import participantsToAdd from "./participantsToAdd.reducer";
import modalSearcher from "./modalSearcher.reducer";
import searcher from "./searcher.reducer";
import discoveredUsers from "./discoveredUsers.reducer";
import modalOpen from "./modalOpen.reducer";
import detailsModalOpen from "./detailsModalOpen.reducer";
import debugReducer from "./debugReducer.reducer";
import alert from "./alert.reducer";
import logged from "./logged.reducer";
import signed from "./signed.reducer";
import loading from "./loading.reducer";
import existence from "./existence.reducer";
import extraParticipantsModalOpen from "./extraParticipantsModalOpen.reducer";
import notification from "./notification.reducer";
import friendRequestReceived from "./friendRequestReceived.reducer";

export default combineReducers({
  messages,
  user,
  conversations,
  friends,
  language,
  currentConversation,
  participantsToAdd,
  modalSearcher,
  searcher,
  discoveredUsers,
  modalOpen,
  detailsModalOpen,
  debugReducer,
  alert,
  logged,
  signed,
  loading,
  existence,
  extraParticipantsModalOpen,
  notification,
  friendRequestReceived,
});
