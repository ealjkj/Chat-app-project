import Header from "./Components/Header";
import Dashboard from "./Components/Dashboard";
import Conversation from "./Components/Conversation";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import "./App.css";

import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { Box, Stack } from "@mui/material";

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

function App() {
  return (
    <Box>
      <BrowserRouter>
        <Routes>
          <Route path="user" element={<User />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path=":conversationId" element={<Conversation />} />
          </Route>

          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
        </Routes>
      </BrowserRouter>
    </Box>
  );
}

export default App;
