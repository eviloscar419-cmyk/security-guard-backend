const mongoose = require('mongoose');

const passwordStatSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  score: { type: Number, required: true },
  label: { type: String, enum: ['WEAK', 'MEDIUM', 'STRONG'], required: true }
}, { timestamps: true });

module.exports = mongoose.model('PasswordStat', passwordStatSchema);