const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { authMiddleware, adminOnly } = require('../middleware/auth');

/**
POST /api/register
body: { username, password, asAdmin } // asAdmin is requested, but will be pending approval
*/
router.post('/register', async (req, res) => {
  try {
    const { username, password, asAdmin } = req.body;
    if (!username || !password) return res.status(400).json({ message: 'username and password required' });
    if (password.length > 12) return res.status(400).json({ message: 'password must be <= 12 characters' });

    let existing = await User.findOne({ username });
    if (existing) return res.status(409).json({ message: 'username already exists' });

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = new User({
      username,
      password: hash,
      isAdmin: asAdmin ? true : false,
      isPendingAdmin: !!asAdmin // if user requested admin, mark pending
    });
    await user.save();

    return res.status(201).json({ message: 'Registered. Admin account requires approval if requested' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
});

/**
POST /api/login
body: { username, password }
returns: { token }
*/
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: 'username and password required' });

    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const payload = { id: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

    return res.json({ token, user: { username: user.username, isAdmin: user.isAdmin, isPendingAdmin: user.isPendingAdmin } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
});

/**
GET /api/admin/pending-admins  (admin only)
returns list of users who requested admin
*/
router.get('/admin/pending-admins', authMiddleware, adminOnly, async (req, res) => {
  try {
    const pending = await User.find({ isPendingAdmin: true }).select('-password');
    res.json({ pending });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

/**
POST /api/admin/approve-admin
body: { userId }
admin only route to approve pending admin request
*/
router.post('/admin/approve-admin', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ message: 'userId required' });
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!user.isPendingAdmin) return res.status(400).json({ message: 'User did not request admin' });

    user.isAdmin = true;
    user.isPendingAdmin = false;
    await user.save();
    res.json({ message: 'User approved as admin', user: { id: user._id, username: user.username, isAdmin: user.isAdmin } });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
