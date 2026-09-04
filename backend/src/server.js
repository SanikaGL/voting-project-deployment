require("dotenv").config();
const app = require("./app");
const http = require("http");//exporting object to create http server
const { connection } = require("mongoose");
const server = http.createServer(app);//creating http server with callback as express function app to handle routes when request comes it gives that to app
const {Server} = require("socket.io");//exporting Server class from socket.io library   
const io = new Server(server, {
  cors: {
    origin: "*"
  }
});//attachong websocket  server to http server and io instace is created
require("./config/subscriber")(io);//passing io server object to redis subscriber which uses io.emit inside 

const PORT = process.env.PORT || 5000;
console.log("🔥 REACHED SERVER.LISTEN");

console.log(process.env.MONGO_URL);
console.log("🔥REACHED SERVER.LISTEN");


const cookieParser = require("cookie-parser");

app.use(cookieParser());
io.on("connection", (socket) => {
   console.log("A client connected to socket:", socket.id);
});// when in frontend uses io it executes this 
console.log("🔥 REACHED SERVER.LISTEN");

server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});







