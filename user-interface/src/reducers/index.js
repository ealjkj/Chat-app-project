import { combineReducers } from "redux";
import chat from "./chat.reducer";
import user from "./user.reducer";

export default combineReducers({ chat, user });
