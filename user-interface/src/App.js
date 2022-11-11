import Dashboard from "./Components/Dashboard";
import Conversation from "./Components/Conversation";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import User from "./Components/User";
import ContactsPage from "./Components/Contacts";
import Settings from "./Components/Settings";
import SettingsChanges from "./Components/SettingsChanges";
import LanguageSettings from "./Components/LanguageSettings";

import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Box } from "@mui/material";
import { Provider } from "react-redux";
import store from "./store";
const loggedIn = false;

function App() {
  return (
    <Provider store={store}>
      <Box>
        <BrowserRouter>
          <Routes>
            <Route path="user" element={<Navigate to="/user/dashboard" />} />

            <Route path="user" element={<User />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route
                path="conversation/:conversationId"
                element={<Conversation />}
              />
              <Route path="contacts" element={<ContactsPage />} />
              <Route path="settings" element={<Settings />}>
                <Route path="account" element={<SettingsChanges />}></Route>
                <Route path="language" element={<LanguageSettings />}></Route>
              </Route>
            </Route>

            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route
              exact
              path="*"
              element={
                loggedIn ? (
                  <Navigate to="user/dashboard" />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
          </Routes>
        </BrowserRouter>
      </Box>
    </Provider>
  );
}

export default App;
