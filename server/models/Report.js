const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  patientId: { type: String, required: true },
  doctorId: { type: String }, // Optional, if uploaded by doctor
  title: { type: String, required: true },
  fileUrl: { type: String, required: true }, // URL from cloud storage
  type: { type: String }, // PDF, Image etc.
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Report', reportSchema);
