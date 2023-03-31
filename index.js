const express = require("express");
const app = express();
require("dotenv").config();
const { init } = require("./socketio");
const { getMqttClient } = require("./mqtt-service");

const authRoute = require("./routes/auth");

const PORT = process.env.PORT || 8400;

app.use(express.json());

app.get("/", (_, res) => {
  res.send("Server is launched");
});

app.use("/api/auth", authRoute);

const server = app.listen(
  PORT,
  console.log(`Server is running on port ${PORT}`)
);

const io = init(server);

io.on("connection", (socket) => {
  console.log("socket.id: ", socket.id);
});
