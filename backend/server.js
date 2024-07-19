const express = require('express');
const app = express();
const port = 3000;
const path = require('path');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Import Routes
const indexRoutes = require('./routes/index');
app.use('/', indexRoutes);

const uploadRoutes = require('./routes/upload');
app.use('/upload', uploadRoutes);

// Custom error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});