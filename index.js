const express = require("express");
const app = express();
const PORT = 8400;

const ADAFRUIT_IO_USERNAME = "tamquattnb123";
const ADAFRUIT_IO_KEY = "aio_SHSq53Ktw0oOxm77yXrUWZRm9Rt9";

app.get("/", (_, res) => {
  res.send("Server is launched");
});

const server = app.listen(
  PORT,
  console.log(`Server is running on port ${PORT}`)
);

// mqtt
const mqtt = require("mqtt");

// socket.io
const { Server } = require("socket.io");

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

const mqttClient = mqtt.connect("wss://io.adafruit.com:443/mqtt/", {
  username: ADAFRUIT_IO_USERNAME,
  password: ADAFRUIT_IO_KEY,
});

mqttClient.on("connect", () => console.log("mqtt: connected"));

io.on("connection", (socket) => {
  console.log(socket.id);
  socket.on("subcribe", (feedKey) => {
    const topic = `${ADAFRUIT_IO_USERNAME}/feeds/${feedKey}`;
    mqttClient.subscribe(topic);
  });

  mqttClient.on("message", (topic, message) => {
    const data = JSON.parse(message.toString());
    socket.emit(topic, data);
  });
});
