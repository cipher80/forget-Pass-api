const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();


router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/forgot-password', userController.requestPasswordReset);
router.post('/reset-password/:token', userController.resetPassword);

module.exports = router;
