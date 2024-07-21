const express = require('express');
const path = require('path');
const cors = require('cors');
const connectDB = require('./config/db')
const customErrorHandler = require('./utils/error')

const port = 3000;
const app = express();

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

// Custom error handler
app.use(customErrorHandler);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});