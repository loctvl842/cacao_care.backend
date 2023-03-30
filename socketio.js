const { Server } = require("socket.io");

let io;

const init = (server) => {
  io = new Server(server, {
    cors: { origin: "*" },
  });
  return io;
};

const getIo = () => {
  if (!io) {
    throw new Error("Socket.io has not been initialized.");
  }
  return io;
};

module.exports = { init, getIo };
