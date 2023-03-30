const router = require("express").Router();
const mqtt = require("mqtt");
const axios = require("axios");
const socketio = require("../socketio");

router.post("/login", async (req, res) => {
  let { adafruit, socketId } = req.body;
  const io = socketio.getIo();

  const mqttClient = mqtt.connect("wss://io.adafruit.com:443/mqtt/", {
    username: adafruit.io_username,
    password: adafruit.io_key,
  });

  mqttClient.on("connect", async () => {
    console.log("mqtt: connected");
    try {
      const result = await axios.get(
        `https://io.adafruit.com/api/v2/${adafruit.io_username}/feeds`
      );
      const feeds = result.data;
      feeds.forEach((feed) => {
        const topic = `${adafruit.io_username}/feeds/${feed.key}`;
        mqttClient.subscribe(topic);
      });
      mqttClient.on("message", (topic, message) => {
        const createdAt = new Date();
        const data = JSON.parse(message.toString());
        io.emit(topic, data, createdAt);
      });
      res.status(200).json({ success: true });
    } catch (e) {
      res.status(500).json("Internal server error.");
    }
  });
  mqttClient.on("error", (error) => {
    if (error.code === 5) {
      io.to(socketId).emit("error", "Invalid crediential.");
    }
    mqttClient.end();
  });
});

module.exports = router;
