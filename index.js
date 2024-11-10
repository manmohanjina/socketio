const express = require("express");
const app = express();
const http = require("http");
const httpServer = http.createServer(app);
const { Server } = require("socket.io");
const { connection } = require("./config/db");
const signup = require("./routes/signup");
const CreateRoomRouter = require("./routes/createRoom");
const authMiddleware = require("./middleware/middleware");
const cors=require('cors')

// CORS configuration for frontend access
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Frontend URL,
    methods:['GET',"POST","PUT","PATCH","DELETE"],
    credentials: true,
  },
});
app.use(cors())

app.use(express.json());

app.use("/user", signup);



app.use("/create", authMiddleware, CreateRoomRouter);

app.use('/user',authMiddleware,CreateRoomRouter)



// Handle new socket connections
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);
  socket.on("joinRoom", ({ roomId, userId }) => {
    socket.join(roomId);
    io.to(roomId).emit("message", `User ${userId} joined the room`);
  });
  socket.on("message", ({ roomId, message }) => {
    io.to(roomId).emit("message", message);
  });
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Start the server
httpServer.listen(8080, () => {
  console.log("Server is running on http://localhost:8080");
  connection();
});
