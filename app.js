const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Use user routes
app.use('/api', userRoutes);

module.exports = app;
