import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  Stack,
} from "@mui/material";
import { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const CREATE_USER = gql`
  mutation ($userInput: UserInput) {
    createUser(userInput: $userInput) {
      success
      errorMessage
    }
  }
`;

const Signup = () => {
  const { t } = useTranslation();
  const [signUpError, setSignUpError] = useState(null);
  const [signUpSuccess, setSignUpSuccess] = useState(false);

  const [createUser] = useMutation(CREATE_USER, {
    onCompleted: ({ createUser }) => {
      setSignUpSuccess(createUser.success);
      setSignUpError(createUser.errorMessage);
    },
  });

  const [inputs, setInputs] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    passwordConfirm: "",
    email: "",
  });
  const handleSubmit = (event) => {
    event.preventDefault();

    const variables = {
      userInput: {
        ...inputs,
      },
    };

    createUser({
      variables,
    });
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
            {t("signup")}
          </Typography>
          <Stack spacing={2} direction="row" sx={{ width: "100%" }}>
            <TextField
              variant="outlined"
              label={t("firstName")}
              name="firstName"
              required
              onChange={handleChange}
            />
            <TextField
              variant="outlined"
              label={t("lastName")}
              name="lastName"
              required
              onChange={handleChange}
            />
          </Stack>
          <TextField
            variant="outlined"
            label={t("username")}
            name="username"
            required
            onChange={handleChange}
          />

          <TextField
            variant="outlined"
            label={t("password")}
            name="password"
            type="password"
            required
            onChange={handleChange}
          />
          <TextField
            variant="outlined"
            label={t("confirmPassword")}
            name="passwordConfirm"
            type="password"
            required
            onChange={handleChange}
          />

          <TextField
            variant="outlined"
            label={t("email")}
            name="email"
            type="email"
            required
            onChange={handleChange}
          />

          <Button variant="contained" type="submit">
            {" "}
            {t("createAccount")}{" "}
          </Button>

          {signUpError || !signUpSuccess ? (
            <Typography> {signUpError}</Typography>
          ) : (
            <Navigate to="/login" />
          )}
        </Stack>
      </Paper>
    </Box>
  );
};

export default Signup;
