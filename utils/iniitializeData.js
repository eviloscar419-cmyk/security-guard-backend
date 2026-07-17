const User =  require('../models/User.js');
const Stats = require('../models/Stats.js');
const ActivityLog = require('../models/ActivityLog.js');


const initializeDefaultData = async () => {
  const adminExists = await User.findOne({ email: 'abdullahiabubakaryusuf170@gmail.com' });
  if (!adminExists) {
    await User.create({
      email: 'abdullahiabubakaryusuf170@gmail.com',
      password: '@habu1234',
      role: 'Admin',
      name: 'Admin'
    });
  }

  const statsExists = await Stats.findOne();
  if (!statsExists) {
    const userCount = await User.countDocuments();
    await Stats.create({ totalUsers: userCount });
  }

  const logExists = await ActivityLog.findOne();
  if (!logExists) {
    await ActivityLog.create({
      action: 'System initialized',
      user: 'System'
    });
  }
};

module.exports = initializeDefaultData;