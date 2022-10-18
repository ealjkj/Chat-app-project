import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  Stack,
  Link,
} from "@mui/material";

const Login = () => {
  return (
    <form>
      <Box
        component="form"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          backgroundColor: "#f2f2f2",
        }}
      >
        <Paper elevation={6}>
          <Stack spacing={2} sx={{ margin: 3 }}>
            <Typography variant="h5" sx={{ textAlign: "center" }}>
              {" "}
              Log In
            </Typography>
            <TextField variant="outlined" label="Username" />

            <TextField variant="outlined" label="Password" type="password" />

            <Button variant="contained"> Submit </Button>
            <Typography>
              Not an account? <Link>Sign up</Link>
            </Typography>
          </Stack>
        </Paper>
      </Box>
    </form>
  );
};

export default Login;
