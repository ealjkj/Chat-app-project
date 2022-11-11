import { combineReducers } from "redux";

import messages from "./messages.reducer";
import user from "./user.reducer";
import conversations from "./conversations.reducer";
import friends from "./friends.reducer";
import language from "./language.reducer";

export default combineReducers({
  messages,
  user,
  conversations,
  friends,
  language,
});
