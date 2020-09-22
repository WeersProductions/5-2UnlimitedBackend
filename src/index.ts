import * as cors from "cors";
import * as socketio from "socket.io";
const app = require("express")();
const http = require("http").createServer(app);
const port = 3000;

const io = socketio(http, {
  handlePreflightRequest: (req, res) => {
    // @ts-ignore
    res.writeHead(200, {
      "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS,POST,PUT,PATCH",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*"
    });
    // @ts-ignore
    res.end();
  }
});

console.log("Server started!");

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello hacker!");
});

app.get("//koffieknop", (req, res) => {
  res.send("Koffie time updated");
  io.emit("refresh");
});

app.post("//koffieknop", (req, res) => {
  res.send("Koffie time updated");
  io.emit("refresh");
});

io.origins((origin, callback) => {
  callback(null, true);
});

io.on("connection", (socket) => {
  console.log("someone connected");
});

http.listen(port, () => {
  console.log(`listening on *: ${port}`);
});
