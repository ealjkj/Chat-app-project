import { Box, CircularProgress, Typography } from "@mui/material";
function LoadingScreen() {
  return (
    <Box
      sx={{
        position: "absoulute",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100vh",
      }}
    >
      <Box>
        <Typography sx={{ textAlign: "center", marginBottom: 5 }} variant="h4">
          Loading...
        </Typography>
        <CircularProgress size={150} />;
      </Box>
    </Box>
  );
}

export default LoadingScreen;
