const User = require('../models/User');
const Student = require('../models/Student');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendEmail } = require('../config/email');

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }

    let user = await User.findOne({ email });

    if (!user) {
      // Create new user
      user = new User({
        name: email.split('@')[0],
        email,
        passwordHash: password,
        role,
        isVerified: false,
      });
      await user.save();

      // Generate OTP and send email
      const otp = generateOTP();
      console.log(`\n\n=== DEVELOPMENT OTP FOR ${email} ===\n${otp}\n======================================\n\n`);
      user.otpHash = crypto.createHash('sha256').update(otp).digest('hex');
      user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
      await user.save();

      const emailHtml = `
        <h2>EDUGUARD Email Verification</h2>
        <p>Your one-time password is: <strong>${otp}</strong></p>
        <p>This OTP expires in 10 minutes.</p>
      `;

      await sendEmail(email, 'EDUGUARD Email Verification', emailHtml);

      return res.status(200).json({
        message: 'User created. Please verify your email with the OTP sent.',
        userId: user._id,
        requiresOTP: true,
      });
    }

    // Existing user - verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    if (!user.isVerified) {
      const otp = generateOTP();
      console.log(`\n\n=== DEVELOPMENT OTP FOR ${email} ===\n${otp}\n======================================\n\n`);
      user.otpHash = crypto.createHash('sha256').update(otp).digest('hex');
      user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
      await user.save();

      const emailHtml = `
        <h2>EDUGUARD Email Verification</h2>
        <p>Your one-time password is: <strong>${otp}</strong></p>
        <p>This OTP expires in 10 minutes.</p>
      `;

      await sendEmail(email, 'EDUGUARD Email Verification', emailHtml);

      return res.status(200).json({
        message: 'OTP sent to your email. Please verify to continue.',
        userId: user._id,
        requiresOTP: true,
      });
    }

    // User verified - issue JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRY }
    );

    res.status(200).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { userId, otp } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const otpHash = crypto.createHash('sha256').update(otp).digest('hex');
    if (user.otpHash !== otpHash || new Date() > user.otpExpiry) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    user.isVerified = true;
    user.otpHash = null;
    user.otpExpiry = null;
    await user.save();

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRY }
    );

    res.status(200).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

    user.otpHash = resetTokenHash;
    user.otpExpiry = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour
    await user.save();

    const resetLink = `http://localhost:3000/reset-password?token=${resetToken}&userId=${user._id}`;
    const emailHtml = `
      <h2>EDUGUARD Password Reset</h2>
      <p><a href="${resetLink}">Click here to reset your password</a></p>
      <p>This link expires in 1 hour.</p>
    `;

    await sendEmail(email, 'EDUGUARD Password Reset', emailHtml);

    res.status(200).json({ message: 'Password reset link sent to your email' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { login, verifyOTP, forgotPassword };
