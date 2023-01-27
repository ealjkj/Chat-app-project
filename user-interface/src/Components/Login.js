import { useTranslation } from "react-i18next";
import { useEffect } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { Link as RouterLinK, Navigate } from "react-router-dom";
import { changeSigned } from "../slices/signed.slice";

const Login = () => {
  const { t } = useTranslation();
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(changeSigned({ value: false }));
  }, []);

  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  });

  const handleChange = (event) => {
    if (event.target.value.length < 40) {
      setInputs((prevState) => ({
        ...prevState,
        [event.target.name]: event.target.value,
      }));
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch({
      type: "LOG_IN",
      payload: {
        user: inputs,
      },
    });
  };

  const notBlank = Boolean(inputs.username) && Boolean(inputs.password);

  if (user) return <Navigate to="/user/dashboard" />;

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
            {t("login")}
          </Typography>
          <TextField
            value={inputs.username}
            variant="outlined"
            label={t("username")}
            name="username"
            onChange={handleChange}
          />

          <TextField
            value={inputs.password}
            variant="outlined"
            label={t("password")}
            type="password"
            name="password"
            onChange={handleChange}
          />

          <Button variant="contained" type="submit" disabled={!notBlank}>
            {t("submit")}
          </Button>
          <Typography>
            {t("notAnAccount") + " "}
            <Link to="/signup" component={RouterLinK}>
              {t("signup")}
            </Link>
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
};

export default Login;
