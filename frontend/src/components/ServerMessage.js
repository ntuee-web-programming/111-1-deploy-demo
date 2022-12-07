import { useState } from "react";

import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

import { api } from "../connection";

// build a counter with @mui/material
function ServerMessage() {
  const [message, setMessage] = useState("");
  const handleGetMessage = async () => {
    const response = await api.get("/");
    setMessage(response.data.message);
  };
  return (
    <Paper
      sx={{
        p: 2,
        margin: "auto",
        width: 400,
      }}
    >
      <Stack direction="column" spacing={2}>
        <Typography variant="h5" component="div">
          Server Message
        </Typography>
        <Typography variant="h4" component="div" align="center">
          {message}
        </Typography>
        <Stack direction="row" spacing={2} justifyContent="center">
          <Button
            variant="contained"
            onClick={handleGetMessage}
          >
            get message
          </Button>
          {/* clear */}
          <Button
            variant="contained"
            onClick={() => setMessage("")}
          >
            clear
          </Button>
        </Stack>
      </Stack>
    </Paper>
  )
}

export default ServerMessage;
