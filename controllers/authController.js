const User =  require('../models/User.js');
const Stats= require('../models/Stats.js');
const ActivityLog = require('../models/ActivityLog.js');


const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ success: false, message: 'Email already registered' });

    const user = await User.create({
      email,
      password,
      name: name || email.split('@')[0].toUpperCase()
    });

    const stats = await Stats.findOne();
    if (stats) { stats.totalUsers = await User.countDocuments(); await stats.save(); }

    await ActivityLog.create({ action: 'New user registered', user: user.name });
    res.status(201).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const stats = await Stats.findOne();
    if (stats) { stats.loginAttempts++; await stats.save(); }

    const user = await User.findOne({ email, password });
    if (!user) {
      if (stats) { stats.failedLogins++; await stats.save(); }
      await ActivityLog.create({ action: 'Failed login attempt', user: email });
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (stats) { stats.successfulLogins++; await stats.save(); }
    await ActivityLog.create({ action: 'User logged in', user: user.name });
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const recoverPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    await ActivityLog.create({ action: 'Password recovery requested', user: user.name });
    res.json({ success: true, name: user.name, password: user.password });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  register,
  login,
  recoverPassword
};
