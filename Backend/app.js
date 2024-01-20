require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

// Import routes
const bookRoutes = require('./routes/book');
const userRoutes = require('./routes/user');

// DB connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée ...'));

const app = express();

// Automatically parses JSON data from incoming requests
app.use(express.json());

// CORS management
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  next();
});

// For each request to the Images folder, manage the resource statically
app.use('/images', express.static(path.join(__dirname, 'images')));
// Define routes to api/books and api/auth using the routes files
app.use('/api/books', bookRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;
