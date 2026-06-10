const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  college: { type: String, required: true },
  department: { type: String, required: true },
  year: { type: String, required: true },
  email: { type: String, required: true },
  mobile: { type: String, required: true },
  workshop: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  certificateId: { type: String },
  certificateUrl: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);