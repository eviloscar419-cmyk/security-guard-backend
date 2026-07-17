const mongoose = require('mongoose');

const statsSchema = new mongoose.Schema({
  totalUsers: { type: Number, default: 1 },
  loginAttempts: { type: Number, default: 0 },
  successfulLogins: { type: Number, default: 0 },
  failedLogins: { type: Number, default: 0 },
  urlsScanned: { type: Number, default: 0 },
  dangerousUrls: { type: Number, default: 0 },
  passwordsAnalyzed: { type: Number, default: 0 },
  weakPasswords: { type: Number, default: 0 },
  strongPasswords: { type: Number, default: 0 },
  systemStatus: { type: String, enum: ['OPTIMAL', 'WARNING', 'CRITICAL'], default: 'OPTIMAL' }
}, { timestamps: true });

module.exports = mongoose.model('Stats', statsSchema);