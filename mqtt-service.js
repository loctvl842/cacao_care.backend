const mqtt = require("mqtt");

let mqttClient;

const connect = ({ cred }) => {
  mqttClient = mqtt.connect("wss://io.adafruit.com:443/mqtt/", {
    username: cred.io_username,
    password: cred.io_key,
  });
};

const getMqttClient = () => {
  return mqttClient;
};

module.exports = { connect, getMqttClient };
