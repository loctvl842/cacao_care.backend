const express = require("express");
const app = express();
const axios = require("axios");
require("dotenv").config();

const PORT = 8400;
const { ADAFRUIT_IO_USERNAME, ADAFRUIT_IO_KEY } = process.env;

app.use(express.json());

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
  cors: { origin: "http://localhost:3000" },
});

const mqttClient = mqtt.connect("wss://io.adafruit.com:443/mqtt/", {
  username: ADAFRUIT_IO_USERNAME,
  password: ADAFRUIT_IO_KEY,
});

mqttClient.on("connect", async () => {
  try {
    const res = await axios.get(
      `https://io.adafruit.com/api/v2/${ADAFRUIT_IO_USERNAME}/feeds`
    );
    const feeds = res.data;
    feeds.forEach((feed) => {
      const topic = `${ADAFRUIT_IO_USERNAME}/feeds/${feed.key}`;
      console.log(topic);
      mqttClient.subscribe(topic);
    });
  } catch (e) {
    console.log(e);
  }
});
mqttClient.on("disconnect", () => console.log("mqtt: disconnected"));

io.on("connection", (socket) => {
  console.log("socket.id: ", socket.id);
});

mqttClient.on("message", (topic, message) => {
  const createdAt = new Date();
  const data = JSON.parse(message.toString());
  io.emit(topic, data, createdAt);
});
