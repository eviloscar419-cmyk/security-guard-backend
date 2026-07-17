const mongoose = require('mongoose');

const phishingReportSchema = new mongoose.Schema({
  url: { type: String, required: true },
  status: { type: String, enum: ['SAFE', 'SUSPICIOUS', 'DANGEROUS', 'DOES NOT EXIST'], required: true },
  score: { type: Number, required: true },
  details: { type: String },
  reasons: { type: [String] },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('PhishingReport', phishingReportSchema);