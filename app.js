const express = require("express");
const app = express();
const path = require("path");
const indexRouter = require("./routes/index");

const http = require("http");
const socketIO = require("socket.io");
const server = http.createServer(app);
const io = socketIO(server);

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let waitingRoom = [];
console.log(waitingRoom);
let rooms = {};
// Receiving connection from web browser to our backend
io.on("connection", (socket) => {
  socket.on("joinroom", () => {
    // receiving emit with same emit name
    if (waitingRoom.length > 0) {
      let partner = waitingRoom.shift();
      const roomName = `${socket.id}-${partner.id}`;

      socket.join(roomName);
      partner.join(roomName);

      io.to(roomName).emit("joined");
    } else {
      waitingRoom.push(socket);
    }
  });
});

app.use("/", indexRouter);

server.listen(3000);
