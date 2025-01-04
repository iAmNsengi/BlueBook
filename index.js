const { log } = require("console");
const http = require("http");
const WebSocketServer = require("websocket").server;
let connection = null;

const httpServer = http.createServer((req, res) => {
  console.log("Request received");
});

const websocket = new WebSocketServer({
  httpServer: httpServer,
});

websocket.on("request", (request) => {
  connection = request.accept(null, request.origin);
  connection.on("open", () => console.log("Connection opened"));
  connection.on("close", () => console.log("Connection closed"));
  connection.on("message", (message) => {
    console.log(`Received message ${message.utf8Data}`);
  });
  sendMessageEvery5Seconds();
});

httpServer.listen(8080, () => console.log("Server is listening on port 8080"));

function sendMessageEvery5Seconds() {
  connection.send(`Message ${Math.random()}`);
  setInterval(() => {
    sendMessageEvery5Seconds();
  }, 5000);
}
