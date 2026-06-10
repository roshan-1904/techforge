const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  certificateId: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  pdfUrl: { type: String, required: true },
  qrCode: { type: String, required: true },
  issueDate: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Certificate', certificateSchema);