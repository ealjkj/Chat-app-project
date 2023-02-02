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
import { Link as RouterLinK, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import createValidators from "../signupValidators";

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

  const validators = createValidators(inputs, t);

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

  let hasBlankInput = false;
  for (let input in inputs) {
    if (inputs[input] === "") hasBlankInput = true;
  }

  const emailError = validations.email.error || existence.email;
  const emailHelperText = existence.email
    ? t("anotherAccountRegistered")
    : validations.email.helperText;

  const usernameError = validations.username.error || existence.username;
  const usernameHelperText = existence.username
    ? t("usernameTaken")
    : validations.username.helperText;

  const passwordsDontMatch =
    inputs.passwordConfirm !== "" && inputs.password !== inputs.passwordConfirm;
  const passwordConfirmError =
    validations.confirmPasswordError || passwordsDontMatch;
  const passwordConfirmHelperText = passwordsDontMatch
    ? t("passwordsMustMatch")
    : validations.passwordConfirm.helperText;

  const invalidSubmit =
    validations.firstName.error ||
    validations.lastName.error ||
    usernameError ||
    validations.password.error ||
    passwordConfirmError ||
    emailError ||
    existence.username ||
    existence.email;

  const disableButton = hasBlankInput || invalidSubmit;
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
              error={validations.firstName.error}
              helperText={validations.firstName.helperText}
              variant="outlined"
              label={t("firstName")}
              name="firstName"
              required
              onChange={handleChange}
            />
            <TextField
              error={validations.lastName.error}
              helperText={validations.lastName.helperText}
              variant="outlined"
              label={t("lastName")}
              name="lastName"
              required
              onChange={handleChange}
            />
          </Stack>
          <TextField
            error={usernameError}
            helperText={usernameHelperText}
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
            error={passwordConfirmError}
            helperText={passwordConfirmHelperText}
            variant="outlined"
            label={t("confirmPassword")}
            name="passwordConfirm"
            type="password"
            required
            onChange={handleChange}
          />

          <TextField
            error={emailError}
            helperText={emailHelperText}
            variant="outlined"
            label={t("email")}
            name="email"
            type="email"
            required
            onChange={handleChange}
          />

          <Button variant="contained" type="submit" disabled={disableButton}>
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
