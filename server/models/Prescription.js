const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Optional for now if manual entry
  patientName: { type: String, required: true },
  medicines: [{
    name: { type: String, required: true },
    dosage: { type: String, required: true },
    frequency: { type: String }
  }],
  notes: { type: String },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Prescription', prescriptionSchema);
