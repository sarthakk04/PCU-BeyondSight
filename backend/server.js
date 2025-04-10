// // server.js
// const express = require("express");
// const http = require("http");
// const { Server } = require("socket.io");
// const cors = require("cors");

// const app = express();
// app.use(cors());

// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:5173", // or your frontend port
//     methods: ["GET", "POST"],
//   },
// });

// io.on("connection", (socket) => {
//   console.log("A user connected");

//   socket.on("joinroom", (room) => {
//     socket.join(room);
//   });

//   socket.on("chat message", ({ room, user, text }) => {
//     io.to(room).emit("chat message", { user, text });
//   });

//   socket.on("disconnect", () => {
//     console.log("A user disconnected");
//   });
// });

// server.listen(5000, () => {
//   console.log("Server running on http://localhost:5000");
// });

// server.js
// const express = require("express");
// const http = require("http");
// const { Server } = require("socket.io");
// const cors = require("cors");

// const app = express();
// app.use(cors());

// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:5173", // or your frontend port
//     methods: ["GET", "POST"],
//   },
// });

// io.on("connection", (socket) => {
//   console.log("A user connected");

//   socket.on("joinroom", (room) => {
//     socket.join(room);
//   });

//   socket.on("chat message", ({ room, user, text }) => {
//     io.to(room).emit("chat message", { user, text });
//   });

//   socket.on("disconnect", () => {
//     console.log("A user disconnected");
//   });
// });

// server.listen(5000, () => {
//   console.log("Server running on http://localhost:5000");
// });

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const geminiRouter = require("./routes/gemini"); // Import the gemini.js file

const app = express();
app.use(cors());
app.use(express.json()); // Middleware to parse JSON bodies

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // or your frontend port
    methods: ["GET", "POST"],
  },
});

// Use the geminiRouter for requests to /gemini
app.use("/gemini", geminiRouter);

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("joinroom", (room) => {
    socket.join(room);
  });

  socket.on("chat message", ({ room, user, text }) => {
    io.to(room).emit("chat message", { user, text });
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

server.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
