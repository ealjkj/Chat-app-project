import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  Stack,
} from "@mui/material";
import { useState } from "react";

const Signup = () => {
  const [inputs, setInputs] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    password2: "",
    email: "",
  });
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(inputs);
  };

  const handleChange = (event) => {
    setInputs((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
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
        maxWidth: "100%",
      }}
      onSubmit={handleSubmit}
    >
      <Paper elevation={6}>
        <Stack spacing={2} sx={{ margin: 3 }}>
          <Typography variant="h5" sx={{ textAlign: "center" }}>
            {" "}
            Sign Up
          </Typography>
          <Stack spacing={2} direction="row" sx={{ width: "100%" }}>
            <TextField
              variant="outlined"
              label="First Name"
              name="firstName"
              required
              onChange={handleChange}
            />
            <TextField
              variant="outlined"
              label="Last Name"
              name="lastName"
              required
              onChange={handleChange}
            />
          </Stack>
          <TextField
            variant="outlined"
            label="Username"
            name="username"
            required
            onChange={handleChange}
          />

          <TextField
            variant="outlined"
            label="Password"
            name="password"
            type="password"
            required
            onChange={handleChange}
          />
          <TextField
            variant="outlined"
            label="Confirm Password"
            name="password2"
            type="password"
            required
            onChange={handleChange}
          />

          <TextField
            variant="outlined"
            label="Email"
            name="email"
            type="email"
            required
            onChange={handleChange}
          />

          <Button variant="contained" type="submit">
            {" "}
            Create Account{" "}
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default Signup;
