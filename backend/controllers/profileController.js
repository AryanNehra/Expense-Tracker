const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');
require('dotenv').config();
const CLOUDINARY_BASE_URL = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/`;

exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const userObj = user.toObject();
    if (userObj.profilePhoto && !userObj.profilePhoto.startsWith('http')) {
      userObj.profilePhoto = `${CLOUDINARY_BASE_URL}${userObj.profilePhoto}`;
    }

    res.json(userObj);
  } catch {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
}

exports.updateProfile = async (req, res, next) => {
  try {
    const userId = req.userId;
    const updates = {
      name: req.body.name,
      email: req.body.email,
    };

    if (req.file) {
      updates.profilePhoto = req.file.path;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    }).select('-password');

    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


exports.changePassword = async (req, res, next) => {
  try {
    const { newPassword } = req.body;
    const hashed = await bcrypt.hash(newPassword, 12);
    await User.findByIdAndUpdate(req.userId, { password: hashed });
    res.json({ message: 'Password updated' });
  } catch {
    res.status(500).json({ error: 'Failed to change password' });
  }
}