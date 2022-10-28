import { gql, useMutation } from "@apollo/client";
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  Stack,
  Link,
} from "@mui/material";
import { useState } from "react";
import { useDispatch } from "react-redux";

import { Link as RouterLinK } from "react-router-dom";

const Login = () => {
  const dispatch = useDispatch();

  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  });

  const handleChange = (event) => {
    setInputs((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("submiting");
    dispatch({
      type: "QUERY_USER",
      payload: {
        user: inputs,
      },
    });
  };

  return (
    <Box
      component="form"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#f2f2f2",
      }}
      onSubmit={handleSubmit}
    >
      <Paper elevation={6}>
        <Stack spacing={2} sx={{ margin: 3 }}>
          <Typography variant="h5" sx={{ textAlign: "center" }}>
            {" "}
            Log In
          </Typography>
          <TextField
            variant="outlined"
            label="Username"
            name="username"
            onChange={handleChange}
          />

          <TextField
            variant="outlined"
            label="Password"
            type="password"
            name="password"
            onChange={handleChange}
          />

          <Button variant="contained" type="submit">
            {" "}
            Submit{" "}
          </Button>
          <Typography>
            Not an account?{" "}
            <Link to="/signup" component={RouterLinK}>
              Sign up
            </Link>
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
};

export default Login;
