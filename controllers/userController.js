const User =  require('../models/User.js');
const ScanHistory = require('../models/ScanHistory.js');
const ActivityLog = require('../models/ActivityLog.js');

const getUserHistory = async (req, res) => {
  try {
    res.json(await ScanHistory.find({ userId: req.params.userId }).sort({ createdAt: -1 }));
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const deleteHistoryItem = async (req, res) => {
  try {
    await ScanHistory.findOneAndDelete({ _id: req.params.id, userId: req.params.userId });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const clearUserHistory = async (req, res) => {
  try {
    await ScanHistory.deleteMany({ userId: req.params.userId });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { email, password, name, profilePicture } = req.body;
    const updateData = {};
    if (email) updateData.email = email;
    if (password) updateData.password = password;
    if (name) updateData.name = name;
    if (profilePicture !== undefined) updateData.profilePicture = profilePicture;

    const updatedUser = await User.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updatedUser) return res.status(404).json({ success: false, message: 'User not found' });

    await ActivityLog.create({ action: 'Profile updated', user: updatedUser.name });
    const userWithoutPassword = updatedUser.toObject();
    delete userWithoutPassword.password;
    res.json({ success: true, user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  getUserHistory,
  deleteHistoryItem,
  clearUserHistory,
  updateProfile,
}