const User = require('../models/User.js');
const Stats = require('../models/Stats.js');
const ActivityLog = require('../models/ActivityLog.js');
const PhishingReport = require('../models/PhishingReport.js');
const PasswordStat = require('../models/PasswordStat.js');

const getAllUsers = async (req, res) => {
  try { res.json(await User.find().select('-password')); }
  catch (error) { res.status(500).json({ success: false, message: 'Server error' }); }
};

const createUser = async (req, res) => {
  try {
    const { email, password, name, role } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ success: false, message: 'Email already registered' });

    const newUser = await User.create({
      email,
      password,
      name: name || email.split('@')[0].toUpperCase(),
      role: role || 'User'
    });

    const stats = await Stats.findOne();
    if (stats) { stats.totalUsers = await User.countDocuments(); await stats.save(); }

    await ActivityLog.create({ action: 'User created by admin', user: newUser.name });
    const userWithoutPassword = newUser.toObject();
    delete userWithoutPassword.password;
    res.status(201).json({ success: true, user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const updateUser = async (req, res) => {
  try {
    const { email, password, name, role, profilePicture } = req.body;
    const updateData = {};
    if (email) updateData.email = email;
    if (password) updateData.password = password;
    if (name) updateData.name = name;
    if (role) updateData.role = role;
    if (profilePicture) updateData.profilePicture = profilePicture;

    const updatedUser = await User.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updatedUser) return res.status(404).json({ success: false, message: 'User not found' });

    await ActivityLog.create({ action: 'User updated by admin', user: updatedUser.name });
    const userWithoutPassword = updatedUser.toObject();
    delete userWithoutPassword.password;
    res.json({ success: true, user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error'});
  }
};

const deleteUser = async (req, res) => {
  try {
    const adminUser = await User.findOne({ email: 'abdullahiabubakaryusuf170@gmail.com' });
    if (adminUser && adminUser._id.toString() === req.params.id) {
      return res.status(403).json({ success: false, message: 'Cannot delete main admin' });
    }
    await User.findByIdAndDelete(req.params.id);
    const stats = await Stats.findOne();
    if (stats) { stats.totalUsers = await User.countDocuments(); await stats.save(); }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getActivityLogs = async (req, res) => {
  try { res.json(await ActivityLog.find().sort({ createdAt: -1 })); }
  catch (error) { res.status(500).json({ success: false, message: 'Server error' }); }
};

const deleteActivityLog = async (req, res) => {
  try { await ActivityLog.findByIdAndDelete(req.params.id); res.json({ success: true }); }
  catch (error) { res.status(500).json({ success: false, message: 'Server error' }); }
};

const clearActivityLogs = async (req, res) => {
  try { await ActivityLog.deleteMany({}); res.json({ success: true }); }
  catch (error) { res.status(500).json({ success: false, message: 'Server error' }); }
};

const getPhishingReports = async (req, res) => {
  try { res.json(await PhishingReport.find().sort({ createdAt: -1 }).populate('userId', 'name')); }
  catch (error) { res.status(500).json({ success: false, message: 'Server error' }); }
};

const deletePhishingReport = async (req, res) => {
  try { await PhishingReport.findByIdAndDelete(req.params.id); res.json({ success: true }); }
  catch (error) { res.status(500).json({ success: false, message: 'Server error' }); }
};

const clearPhishingReports = async (req, res) => {
  try { await PhishingReport.deleteMany({}); res.json({ success: true }); }
  catch (error) { res.status(500).json({ success: false, message: 'Server error' }); }
};

const getPasswordStats = async (req, res) => {
  try { res.json(await PasswordStat.find().sort({ createdAt: -1 }).populate('userId', 'name')); }
  catch (error) { res.status(500).json({ success: false, message: 'Server error' }); }
};

const deletePasswordStat = async (req, res) => {
  try { await PasswordStat.findByIdAndDelete(req.params.id); res.json({ success: true }); }
  catch (error) { res.status(500).json({ success: false, message: 'Server error' }); }
};

const clearPasswordStats = async (req, res) => {
  try { await PasswordStat.deleteMany({}); res.json({ success: true }); }
  catch (error) { res.status(500).json({ success: false, message: 'Server error' }); }
};

const updateSettings = async (req, res) => {
  try {
    const stats = await Stats.findOne();
    if (stats) {
      stats.systemStatus = req.body.systemStatus || stats.systemStatus;
      await stats.save();
      await ActivityLog.create({ action: 'System settings updated', user: 'Admin' });
    }
    res.json({ success: true, stats });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const resetStats = async (req, res) => {
  try {
    const stats = await Stats.findOne();
    if (stats) {
      stats.loginAttempts = stats.successfulLogins = stats.failedLogins = stats.urlsScanned = stats.dangerousUrls = stats.passwordsAnalyzed = stats.weakPasswords = stats.strongPasswords = 0;
      stats.systemStatus = 'OPTIMAL';
      await stats.save();
      await ActivityLog.create({ action: 'All system stats reset', user: 'Admin' });
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
module.exports = {
  getActivityLogs,
  deleteActivityLog,
  clearActivityLogs,
  getPhishingReports,
  deletePhishingReport,
  clearPhishingReports,
  getPasswordStats,
  deletePasswordStat,
  clearPasswordStats,
  updateSettings,
  resetStats,
  deleteUser,
  updateUser,
  getAllUsers,
  createUser,
}
