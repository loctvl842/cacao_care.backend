const express = require("express");
const app = express();

const PORT = 8400;

app.get("/", (_, res) => {
  res.send("<h1>Hello world</h1>");
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
