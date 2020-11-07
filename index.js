const app = require("express")();
const server = require("http").createServer(app);
const socket = require("socket.io");
const io = socket(server, { origins: "*:*" });

const users = {};

io.on("connection", (socket) => {
  if (!users[socket.id]) {
    users[socket.id] = socket.id;
  }

  socket.emit("yourID", socket.id);
  io.sockets.emit("allUsers", users);
  socket.on("disconnect", () => {
    delete users[socket.id];
  });

  socket.on("callUser", (data) => {
    io.to(data.userToCall).emit("hey", {
      signal: data.signalData,
      from: data.from,
    });
  });

  socket.on("acceptCall", (data) => {
    io.to(data.to).emit("callAccepted", data.signal);
  });
});

const SERVER_PORT = 1234;

server.listen(SERVER_PORT, () =>
  console.log(`🚀 Server is running on port ${SERVER_PORT} `)
);
