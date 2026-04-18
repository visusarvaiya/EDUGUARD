const express = require('express');
const { login, verifyOTP, forgotPassword } = require('../controllers/authController');

const router = express.Router();

router.post('/login', login);
router.post('/verify-otp', verifyOTP);
router.post('/forgot-password', forgotPassword);

module.exports = router;
