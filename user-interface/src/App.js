import Header from "./Components/Header";
import Dashboard from "./Components/Dashboard";
import Conversation from "./Components/Conversation";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import ContactsPage from "./Components/Contacts";
import "./App.css";

import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";
import { Box, Stack } from "@mui/material";
import { Provider } from "react-redux";
import store from "./store";

const User = () => {
  return (
    <>
      <Stack sx={{ height: "100vh" }}>
        <Header></Header>
        <Outlet />
      </Stack>
    </>
  );
};

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
