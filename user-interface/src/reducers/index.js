import { combineReducers } from "redux";
import messages from "./messages.reducer";
import user from "./user.reducer";
import conversations from "./conversations.reducer";
import friends from "./friends.reducer";

export default combineReducers({ messages, user, conversations, friends });
