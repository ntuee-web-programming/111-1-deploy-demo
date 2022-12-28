import { useEffect, useState } from "react";

import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

import { ws } from "../connection";

function WebsocketNumber() {
  const [message, setMessage] = useState(0);

  useEffect(() => {
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessage(data.number);
    };
  }, []);

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
          WebSocket Number
        </Typography>
        <Typography variant="h4" component="div" align="center">
          {message}
        </Typography>
      </Stack>
    </Paper>
  );
}

export default WebsocketNumber;
