import express from "express";
import { Server } from "socket.io";

const app = express();

app.use(express.json());

let clients = [];
const server = app.listen(4000, () => {
  console.log("Socket server started on port 4000");
});

const socketIo = new Server(server, {
  cors: {
    origin: "*",
  },
});

socketIo.on("connection", (socket) => {
  const authHeader = socket.handshake.headers.authorization;
  const authToken = authHeader.replace("Bearer ", "");
  socket.jwt = authToken;

  clients.push(socket);

  clients.forEach((client) => {
    client.emit("new-connection", clients.length + " users has connected");
  });

  socket.on("disconnect", () => {
    console.log("User left");
    clients = clients.filter((client) => client != socket);
  });
});

app.get("/channel/", (req, res) => {
  clients.forEach((client) => {
    client.emit("new-channel", "socket refreshed channels");
  });

  res.send("Socket refreshed channels");
});

app.get("/message/", (req, res) => {
  console.log("Message socket emitted");

  const emitData = {
    id: req.query.roomId,
  };

  clients.forEach((client) => {
    client.emit("new-message", emitData);
  });

  res.send("Socket refreshed messages");
});

app.get("/broadcast/", (req, res) => {
  clients.forEach((client) => {
    client.emit("new-broadcast", "refreshed broadcasts");
  });

  res.send("Socket refreshed broadcasts");
});
