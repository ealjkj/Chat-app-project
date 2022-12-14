import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  Stack,
  Link,
} from "@mui/material";
import { useEffect, useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { Link as RouterLinK, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

const Signup = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const signed = useSelector((state) => state.signed);
  const existence = useSelector((state) => state.existence);
  const [inputs, setInputs] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    passwordConfirm: "",
    email: "",
  });

  const [validations, setValidations] = useState({
    firstName: { error: false, helperText: "" },
    lastName: { error: false, helperText: "" },
    username: { error: false, helperText: "" },
    password: { error: false, helperText: "" },
    passwordConfirm: { error: false, helperText: "" },
    email: { error: false, helperText: "" },
  });

  useEffect(() => {
    if (inputs.username) {
      dispatch({
        type: "QUERY_USER_EXISTENCE",
        payload: { username: inputs.username },
      });
    }
  }, [inputs.username, dispatch]);

  useEffect(() => {
    if (inputs.email) {
      dispatch({
        type: "QUERY_EMAIL_EXISTENCE",
        payload: { email: inputs.email },
      });
    }
  }, [inputs.email, dispatch]);

  const validators = {
    password: (value) => {
      if (value.length < 8)
        return {
          error: true,
          helperText: "Password should at least 8 characters long",
        };

      return { error: false, helperText: "" };
    },

    passwordConfirm: (value) => {
      if (inputs.password !== value)
        return {
          error: true,
          helperText: "Passwords should Match",
        };

      return { error: false, helperText: "" };
    },
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch({ type: "SIGN_UP", payload: { userInput: inputs } });
  };

  const handleChange = (event) => {
    const fieldName = event.target.name;
    const validator = validators[fieldName];
    const value = event.target.value;

    setInputs((prevState) => ({
      ...prevState,
      [fieldName]: value,
    }));

    if (validator) {
      setValidations({ ...validations, [fieldName]: validator(value) });
    }
  };

  const validSubmit =
    !validations.firstName.error &&
    !validations.lastName.error &&
    !validations.username.error &&
    !validations.password.error &&
    !validations.passwordConfirm.error &&
    !validations.email.error &&
    !existence.username &&
    !existence.email;

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
            error={existence.username}
            helperText={
              existence.username ? `${inputs.username} already taken` : ""
            }
            variant="outlined"
            label={t("username")}
            name="username"
            required
            onChange={handleChange}
          />

          <TextField
            error={validations.password.error}
            helperText={validations.password.helperText}
            variant="outlined"
            label={t("password")}
            name="password"
            type="password"
            required
            onChange={handleChange}
          />
          <TextField
            error={validations.passwordConfirm.error}
            helperText={validations.passwordConfirm.helperText}
            variant="outlined"
            label={t("confirmPassword")}
            name="passwordConfirm"
            type="password"
            required
            onChange={handleChange}
          />

          <TextField
            error={existence.email}
            helperText={
              existence.email ? `Another account has registered this email` : ""
            }
            variant="outlined"
            label={t("email")}
            name="email"
            type="email"
            required
            onChange={handleChange}
          />

          <Button variant="contained" type="submit" disabled={!validSubmit}>
            {" "}
            {t("createAccount")}{" "}
          </Button>
          <Typography>
            {t("backToLogin") + " "}
            <Link to="/login" component={RouterLinK}>
              {t("login")}
            </Link>
          </Typography>

          {signed ? <Navigate to="/login" /> : null}
        </Stack>
      </Paper>
    </Box>
  );
};

export default Signup;
