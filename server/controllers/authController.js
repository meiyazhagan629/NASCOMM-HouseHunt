const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'househunt_super_secret_jwt_key_2026_nascomm_project',
    {
      expiresIn: process.env.JWT_EXPIRE || '7d'
    }
  );
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { name, username, email, password, role, phone, avatar } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password'
      });
    }

    // Clean identifiers
    const cleanedEmail = email.toLowerCase().trim();
    const cleanedUsername = username ? username.toLowerCase().trim() : cleanedEmail.split('@')[0].replace(/[^a-zA-Z0-9_.-]/g, '');

    // Check if email already registered
    const emailExists = await User.findOne({ email: cleanedEmail });
    if (emailExists) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists in MongoDB'
      });
    }

    // Check if username/userId is already taken
    if (cleanedUsername) {
      const usernameExists = await User.findOne({ username: cleanedUsername });
      if (usernameExists) {
        return res.status(400).json({
          success: false,
          message: `User ID '${cleanedUsername}' is already taken. Please choose another.`
        });
      }
    }

    // Role assignment (support renter, owner, or admin)
    const assignedRole = role === 'admin' ? (req.body.adminSecret === 'ADMIN2026' || process.env.ADMIN_SECRET === req.body.adminSecret ? 'admin' : 'renter') : (role || 'renter');

    // Create user in MongoDB (password will be automatically bcrypt-hashed by pre-save hook)
    const user = await User.create({
      name: name.trim(),
      username: cleanedUsername,
      email: cleanedEmail,
      password,
      role: assignedRole,
      phone: phone || '+1 (555) 019-2834',
      avatar: avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Account created and saved to MongoDB successfully',
      token,
      user: {
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Login user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, username, identifier, password } = req.body;
    const loginId = (identifier || email || username || '').toLowerCase().trim();

    if (!loginId || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your User ID or Email, and your Password'
      });
    }

    // Match either email or username in MongoDB
    const user = await User.findOne({
      $or: [
        { email: loginId },
        { username: loginId }
      ]
    }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'No account found matching this User ID / Email in MongoDB'
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Password is incorrect.'
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Please contact an administrator.'
      });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Logged in successfully from MongoDB',
      token,
      user: {
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({
      success: true,
      user
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, avatar } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (avatar) user.avatar = avatar;

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar
      }
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  updateProfile
};
