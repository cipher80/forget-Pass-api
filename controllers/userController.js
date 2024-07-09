const User = require('../models/User');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const nodemailer = require('nodemailer');
const { generateResetEmail } = require('../views/emailTemplates.js');

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: 'Gmail', //  email service provider
  auth: {
    user: 'ashutoshp218@gmail.com', 
    pass: 'emnzmmoyingfwptp' 
  }
});

// Register a new user
exports.register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
      const user = new User({ name, email, password });
      await user.save();
      res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  // Login user and generate JWT
  exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
      const token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
      res.status(200).json({ message: 'Login successful', token });
    } catch (err) {
      res.status(500).json({ message: 'Internal server error' });
    }
  };





// Request password reset
exports.requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHashed = crypto.createHash('sha256').update(resetToken).digest('hex');

    user.resetPasswordToken = resetTokenHashed;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    const resetUrl = `http://localhost:3000/api/reset-password/${resetToken}`;
    const mailOptions = {
      to: user.email,
      from: 'ashutoshp218@gmail.com',
      subject: 'Password Reset Request',
      html: generateResetEmail(resetUrl)
    };

    transporter.sendMail(mailOptions, (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error sending email' });
      }
      res.status(200).json({ message: 'Reset link sent to your email' });
    });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Verify and reset password
exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const resetTokenHashed = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
      resetPasswordToken: resetTokenHashed,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Password reset token is invalid or has expired' });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Password has been reset' });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
};
