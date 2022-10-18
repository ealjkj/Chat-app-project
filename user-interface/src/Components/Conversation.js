import { Box, Typography, Grid, Stack } from "@mui/material";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const emptyUser = {
  username: "ealjkj",
  firstName: "",
  lastName: "",
  email: "",
  avatar: "",
  description: "",
  friends: [],
};

const Conversation = () => {
  const [user, setUser] = useState(emptyUser);
  const params = useParams();
  const conversationId = params.conversationId;

  useEffect(() => {
    fetch("../profile.json")
      .then((response) => response.json())
      .then((data) => {
        return setUser(data);
      });
  }, []);

  return (
    <Grid container sx={{ height: "100%", opacity: 0.5 }}>
      <Grid item md={3}>
        <Stack
          sx={{
            backgroundColor: "pink",
            overflowY: "scroll",
            maxHeight: "100%",
            height: "100%",
          }}
        >
          {Array(50)
            .fill("hola")
            .map((text, index) => {
              return <Typography key={index}>{index}</Typography>;
            })}
        </Stack>
      </Grid>
    </Grid>
  );
};

export default Conversation;
