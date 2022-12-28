import Stack from "@mui/material/Stack";

import logo from './logo.svg';
import ClientCounter from "./components/ClientCounter";
import ServerMessage from "./components/ServerMessage";
import WebsocketNumber from "./components/WebsocketNumber";

function App() {
  return (
    <Stack
      sx={{ width: "100%" }}
      spacing={2}
      direction="column"
      alignItems="center"
    >
      <img src={logo} alt="logo" style={{ width: "100px", height: "100px" }} />
      <ClientCounter />
      <ServerMessage />
      <WebsocketNumber />
    </Stack>
  );
}

export default App;
