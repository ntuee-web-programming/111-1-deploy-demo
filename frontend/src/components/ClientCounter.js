import { useState } from "react";

import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

// build a counter with @mui/material
function ClientCounter() {
  const [count, setCount] = useState(0);
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
          Client Counter
        </Typography>
        <Typography variant="h2" component="div" align="center">
          {count}
        </Typography>
        <Stack direction="row" spacing={2} justifyContent="center">
          <Button
            variant="contained"
            onClick={() => setCount(n => n + 1)}
          >
            Increment
          </Button>
          <Button
            variant="contained"
            onClick={() => setCount(n => n - 1)}
          >
            Decrement
          </Button>
        </Stack>
      </Stack>
    </Paper>
  )
}

export default ClientCounter;
