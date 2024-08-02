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

const notificationRoute = require('./routes/notification');
app.use('/notification', notificationRoute);

const friendsRoute = require('./routes/friends');
app.use('/friends', friendsRoute);


// socket
io.on('connection', (socket) => {
  console.log("User Connected");
  socket.emit('welcome', { message: 'Welcome to the chat!' });

  socket.on('identify', (userId, callback) => {
    socketController.onSocketIdentify(socket, userId, callback);
  });

  socket.on('join-rooms', (payload, callback) => {
    socketController.onSocketJoinRooms(socket, payload, callback);

  });

  socket.on('notification', (payload, callback) => {
    socketController.onSocketNotification(socket, payload, callback);

  })

  socket.on('private-message', (payload, callback) => {
    socketController.onSocketPrivateMessage(socket, payload, callback);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Custom error handler
app.use(customErrorHandler);

server.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});