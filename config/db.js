const mongoose = require('mongoose');

// MongoDB URI 
const dbUri = 'mongodb+srv://sandeeptiwari222:1234@practice.t3zr9uz.mongodb.net/forgetPassword';

mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

module.exports = mongoose;
