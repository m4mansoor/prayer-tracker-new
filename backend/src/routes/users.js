const express = require('express');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const User = require('../models/User');
const router = express.Router();

// Update user settings
router.patch('/settings', auth, async (req, res) => {
  try {
    const allowedSettings = [
      'currency',
      'timeZone',
      'prayerTimeAdjustments',
      'fineAmounts',
      'notifications'
    ];

    const updates = Object.keys(req.body);
    const isValidOperation = updates.every(update => allowedSettings.includes(update));

    if (!isValidOperation) {
      return res.status(400).json({ error: 'Invalid updates' });
    }

    updates.forEach(update => {
      req.user.settings[update] = req.body[update];
    });

    await req.user.save();
    res.json({ settings: req.user.settings });
  } catch (error) {
    res.status(500).json({ error: 'Error updating settings' });
  }
});

// Update user profile
router.patch('/profile', [
  auth,
  body('name').optional().trim().notEmpty(),
  body('email').optional().isEmail(),
  body('password').optional().isLength({ min: 6 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    if (name) req.user.name = name;
    if (email) req.user.email = email;
    if (password) req.user.password = password;

    await req.user.save();

    res.json({
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        settings: req.user.settings
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Error updating profile' });
  }
});

// Delete user account
router.delete('/', auth, async (req, res) => {
  try {
    await req.user.remove();
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting account' });
  }
});

module.exports = router;
