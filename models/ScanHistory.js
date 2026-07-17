const mongoose = require('mongoose');

const scanHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['password', 'phishing'], required: true },
  result: { type: mongoose.Schema.Types.Mixed, required: true }
}, { timestamps: true });

module.exports =mongoose.model('ScanHistory', scanHistorySchema);