const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema({
  action: { type: String, required: true },
  user: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model("ActivityLog", activityLogSchema);