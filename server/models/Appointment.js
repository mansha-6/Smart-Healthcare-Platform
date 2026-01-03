const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctorId: { type: String, ref: 'User', required: true }, // Changed to String to support Mock IDs
  doctorName: { type: String }, // Snapshot incase join fails
  doctorImage: { type: String },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  type: { type: String, required: true }, // 'online' or 'physical'
  fees: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled', 'completed', 'rescheduled'], default: 'confirmed' },
  reason: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Appointment', appointmentSchema);
