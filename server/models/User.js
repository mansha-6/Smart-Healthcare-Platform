const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true }, // Removed unique: true
  password: { type: String, required: true },
  role: { type: String, enum: ['patient', 'doctor', 'admin', 'staff'], default: 'patient' },
  phone: { type: String },
  address: { type: String },
  gender: { type: String, enum: ['Male', 'Female', 'Other'] }, 
  age: { type: Number },
  
  // Doctor Specific Fields
  specialization: { type: String },
  experience: { type: Number },
  fees: { type: Number },
  isAvailable: { type: Boolean, default: true },
  bio: { type: String },
  schedule: {
    days: [{ type: String }], // e.g., ["Mon", "Tue"]
    timeSlots: {
        Morning: [{ type: String }],
        Afternoon: [{ type: String }],
        Evening: [{ type: String }]
    }
  },
  
  // Staff Specific Fields
  jobTitle: { type: String }, // e.g. Nurse, Receptionist
  department: { type: String },
  
  // Patient Specific Fields
  medicalHistory: [{ type: String }],
  
  createdAt: { type: Date, default: Date.now }
});

// Compound Unique Index: Allow same email for different roles
userSchema.index({ email: 1, role: 1 }, { unique: true });

module.exports = mongoose.model('User', userSchema);
