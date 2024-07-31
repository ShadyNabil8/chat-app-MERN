const express = require('express');
const http = require('http');
const path = require('path');
const cors = require('cors');
const connectDB = require('./config/db')
const customErrorHandler = require('./utils/error')
const { Server } = require("socket.io");
const socketController = require('./controllers/socket')

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

const port = 4000;

// Connect to MongoDB
connectDB();

// Allow all origins
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Import Routes
const indexRoutes = require('./routes/index');
app.use('/', indexRoutes);

const uploadRoutes = require('./routes/upload');
app.use('/upload', uploadRoutes);

const userRoute = require('./routes/User');
app.use('/user', userRoute);


// socket
// io.on('connection', socketController.onSocketConnect);
// io.on('disconnect', socketController.onSocketDisconnect);
// // io.on('m', socketController.onSocketMessage);
// io.on("news", (data) => {
//   console.log(data);
// });
io.on('connection', (socket) => {
  console.log("User Connected");
  socket.on('chat message', socketController.onSocketMessage);
  socket.on('disconnect', socketController.onSocketDisconnect);
});

// Custom error handler
app.use(customErrorHandler);

server.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});