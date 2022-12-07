import path from "path";

import express from "express";
import cors from "cors";

const app = express();
// init middleware
if (process.env.NODE_ENV === "development") {
  app.use(cors());
}
// define routes
app.get("/api", (req, res) => {
  // send the request back to the client
  console.log("GET /api");
  res.send({ message: "Hello from the server!" }).status(200);
});

if (process.env.NODE_ENV === "production") {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, "../frontend", "build")));
  app.get("/*", function (req, res) {
    res.sendFile(path.join(__dirname, "../frontend", "build", "index.html"));
  });
}

// define server
const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Server is up on port ${port}.`);
});
