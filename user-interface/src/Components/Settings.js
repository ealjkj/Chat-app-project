import { Grid } from "@mui/material";
import { Outlet } from "react-router-dom";
import SettingsList from "./SettingsList";

export default function Settings() {
  return (
    <Grid container>
      <Grid
        item
        md={3}
        sx={{
          height: "calc( 100vh - 64px)",
          overflowY: "scroll",
        }}
      >
        <SettingsList />
      </Grid>

      <Grid item md={9}>
        <Outlet />
      </Grid>
    </Grid>
  );
}
