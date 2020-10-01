import * as cors from "cors";
import * as socketio from "socket.io";
import {retrieveValue, updateValue, coffeeTimeLocation, sheetId, currentConnectionsLocation} from "./google";
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

const updateConnections = async () => {
  await updateValue(sheetId, currentConnectionsLocation, [[Object.keys(io.sockets.sockets).length.toString()]]);
}

updateConnections();
console.log("Server started!");

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello hacker (tim?)!");
});

app.get("/koffieknop", async (req, res) => {
  const current_coffeetime = await retrieveValue("1A8DtGaMWRQLwMGbuuk_6u7FQRAa_KZ70nKfFkA1MiBo", coffeeTimeLocation);
  res.send(`De laatste keer dat iemand die knop indrukte: ${new Date(current_coffeetime.data.values[0][0]).toTimeString()}`);
});

app.post("/koffieknop", async (req, res) => {
  await updateValue(sheetId, coffeeTimeLocation, [[new Date()]])
  res.send("Koffie time updated");
  io.emit("refresh");
});

io.origins((origin, callback) => {
  callback(null, true);
});

io.on("connection", async (socket) => {
  await updateConnections();
  console.log("someone connected");
});

io.on("disconnect", async () => {
  await updateConnections();
});

http.listen(port, () => {
  console.log(`listening on *: ${port}`);
});
